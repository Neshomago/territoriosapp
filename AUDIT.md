# territoriosapp Audit

## Summary

Reviewed the full app: routing/auth layer (`App.jsx`, `AuthProvider.jsx`, `PrivateRoutes.jsx`), the
Firestore data layer (`firebase.jsx`, `contexts/grupoContext.jsx`, `utils/_utils.js`), every routed
feature page (`Home`, `GroupSelector`, `GroupSelectorRenamer`, `FolioTable`, `AdminPanel`,
`PDFVisualizer`, `PDFPageInfoEdit`), and the two in-progress/untracked "predicación" files plus the
unrouted PDF components. No test files, no CI, and no `firestore.rules` exist anywhere in the repo.

**Headline findings:**
1. `IS_TEST_MODE = true` is hardcoded in `firebase.jsx` — if this ships as-is, production users read/write
   the *test* Firestore collections, not the real ones.
2. Every new signup (`AuthProvider.jsx`) is granted `roles: ["user","admin"]` — every user is an admin,
   and nothing in the app or Firestore enforces roles server-side (there's no `firestore.rules` file at all).
3. A `record.id: null` field written on folio-record creation gets echoed back by Firestore, read back
   into state, and clobbers the real document ID — this silently breaks editing/deleting new records
   (`grupoContext.jsx` + `FolioTable.jsx`).
4. Every group's "view map" image is hardcoded to Mejía's PNG in the live data (`_utils.js`), and ~71% of
   that same file (2,080+ lines) is dead exported data no longer used anywhere.
5. Zero automated tests exist, and there's no `firestore.rules`, so authorization is effectively enforced
   nowhere — not in the client (which shows the admin panel to everyone) and not at the database layer.

---

## Production Verification (checked 2026-09-24, corrected same day)

The Chrome extension needed to drive a live browser wasn't connected in this session, and Firebase
CLI login needs to happen interactively in your own terminal, so full runtime/Firestore-document
verification is still open (see "Open verification items" below). That said, two direct checks were
possible without either of those — fetching the live bundle over HTTP, and diffing `main`/`dev`
against it — and they clear up which branch is actually live (an earlier pass of this section got
this backwards; corrected below):

- **Production is running code from `dev`, not `main`.** The deployed bundle's `Last-Modified`
  header reads `Sat, 15 Aug 2026 20:04:12 UTC`, which lines up almost exactly (~6 minutes later)
  with `dev`'s last commit, `8dd3b3d "fix: image route for maps and title bar"`
  (`2026-08-15 14:58:18 -0500` = `19:58:18 UTC`). Confirmed further: the live bundle contains the
  `dev`-only offline-persistence console string (`"🔥 ... persistencia offline"`) and FolioTable's
  `"Nueva Asignación"` text, neither of which exist on `main`. `main` (4+ months stale, last touched
  in April) is not what users are hitting.
- **`IS_TEST_MODE` was `false` in that build** (no `_test`-suffixed collection name literals in the
  bundle) — consistent with the developer's stated workflow of flipping it to `false` locally right
  before running `firebase deploy`.
- The two untracked files (`PredicacionEditor.jsx`, `PredicacionView.jsx`) are confirmed **not** in
  the live bundle (`"arregloPredicacion"`, their Firestore collection name, has zero hits) — expected,
  since neither is routed or committed yet.
- Practical upshot: essentially everything in this audit describes the app real users are using
  right now, as of the `8dd3b3d` build — not a future/unreleased state. In particular:
  - **The map-image bug is confirmed live** — the deployed bundle's asset references match the
    `_utils.js` bug exactly (9 occurrences of `territorio-mejia`, 1 each for the other 6 group
    images). Real users clicking "Ver Mapa General" for any group except Mejía see the wrong map
    right now.
  - **The `id: null` folio-record corruption bug is live**, since `FolioTable`/`grupoContext` are
    both part of this build.
  - **The hardcoded Firebase config (including the API key and Google Maps key) is genuinely what's
    shipping** — the exact key value from `firebase.jsx` (`AIzaSyADR_...`) is present verbatim in the
    live bundle. `main`'s committed source uses `import.meta.env.VITE_FIREBASE_*` env vars instead
    (an older, better pattern from before this file was rewritten on `dev`) — worth porting that
    approach back onto `dev`'s new Firestore-persistence/`COLLECTIONS` logic rather than picking one
    file over the other wholesale, once `dev` becomes the merge target.
  - **`IS_TEST_MODE` was `false` for this specific build**, per your own manual-toggle workflow — the
    risk described in the findings below is unchanged though: it's a human-memory-only safeguard,
    with nothing in the repo (no build-time check, no CI gate, no lint rule) to catch a forgotten
    toggle before a future `firebase deploy`. The fix isn't "stop doing this," it's "make it
    impossible to forget" — see Quick Wins.
- **The legacy `{ pages: [...] }` data-shape branches are confirmed genuinely dead, not just
  unreachable-by-my-reading.** `main` already reads/writes territory documents as `{ mapa: { area } }}`
  (same shape `dev` uses), so live Firestore documents were never in the `{ pages }` shape assumed by
  `PdfEditor.jsx` and the dead fallback branch in `PDFVisualizer.jsx` — those two fixture JSON files
  are the only place that shape still exists.

**Open verification items** (need either your terminal or a working browser connection to close out):
- Actual sample Firestore documents, to double check things like the `completed: 1` vs `completed: true`
  mixed-type finding and the accent-stripping fallback-image bug against real (not seed) data.
- Whatever `dev` looks like once actually running against live data in a real browser — console
  errors, network waterfall, and whether the admin-panel/role-visibility issue is as wide-open in
  practice as the code suggests.

If you still want these, either: (a) paste a couple of real documents from the Firebase console here,
(b) get `firebase login` working in your own terminal (see below) and I'll query further, or (c) get
the Claude-in-Chrome extension connected (chromewebstore link) and I can drive the live site directly.
On the `npx firebase-tools@latest login` 404 — it resolved fine from here (`npx firebase-tools@latest --version` → `15.31.0` against the standard `registry.npmjs.org`), so it's likely something specific to your shell's environment (a proxy or registry override in a shell profile, or a stale npx cache) rather than the package itself; worth trying `npm view firebase-tools version` in that same terminal to see if it's an npx-specific problem or an npm-wide one.

---

## Architecture Overview

| Layer | What it is |
|---|---|
| Build | Vite 5 + `@vitejs/plugin-react-swc`, no TypeScript |
| Routing | `react-router-dom` v6, single `PrivateRoutes` gate (auth-only, no role check) wrapping all authenticated routes, `/login` outside it |
| State | Two React Contexts: `AuthProvider` (Firebase Auth) and `DatosGrupoProvider` (`grupoContext.jsx`, all territory/folio Firestore reads+writes) |
| Data | Firebase Firestore, offline-persisted (`persistentLocalCache`), collections resolved via `COLLECTIONS` map in `firebase.jsx` |
| UI | HeroUI (`@heroui/react`) + Tailwind |
| PDF | `pdf-lib` (generation/fill) + `pdfjs-dist` (rendering), two independent worker-setup mechanisms exist (`PDFCanvasViewer.jsx` inline vs. unused `utils/pdfWorker.js`) |
| Tests / CI | None. No `*.test.*`/`*.spec.*` files, no `.github/` workflows, no coverage config |

**Routes (`App.jsx`):** `/`, `/home`, `/grupo`, `/foliotable`, `/grouprenamer`, `/pdfvisualizer`,
`/pdfpageinfoedit`, `/adminpanel` (all behind `PrivateRoutes`, none behind a role check), `/login`
(public), `*` → `ErrorPage`.

**Not routed / dead:** `PdfEditor.jsx`, `PredicacionEditor.jsx`, `PredicacionView.jsx` are not
referenced by any `<Route>` — the latter two are the untracked files you're actively building, so
their bugs below are still latent, not live.

---

## Findings

### Security & Authorization

- **`firebase.jsx:45`** — `export const IS_TEST_MODE = true;` is a hardcoded flag (not env-driven) that
  switches `COLLECTIONS.TERRITORIES` / `FOLIO_RECORDS` / `LEGACY_FOLIO` between `_test` suffixed and
  real collection names. Confirmed with the developer: the current workflow is to manually set this to
  `true` during development and flip it back to `false` by hand before each `firebase deploy`. There is
  no build-mode branching (e.g. `import.meta.env.PROD`) and nothing in the repo enforces the manual
  flip, so it depends entirely on remembering to do it correctly, every single deploy, with silent
  failure (writing to test collections in production) as the consequence of forgetting.
- **`AuthProvider.jsx:38, 72`** — both `loginWithGoogle` and `loginWithOutlook` create a new user doc with
  `roles: ["user","admin"]` on first login. There is no invite/approval flow — anyone who can sign in with
  Google or Microsoft becomes an admin on the spot.
- **No `firestore.rules` file anywhere in the repo.** Combined with the point above, every Firestore
  mutation exposed by `grupoContext.jsx` (`toggleManzanaStatus`, `updateTerritoryDetails`,
  `archiveAndRestartSingleTerritory`, `saveFolioRecord`, `deleteFolioRecord`) is callable by any
  authenticated user directly (e.g. from devtools), not just through the UI.
- **`NavbarApp.jsx:104-111`** — the "Panel de Administración" link renders unconditionally for every
  logged-in user; there's no `user.roles.includes('admin')` check anywhere in the dropdown.
- **`AdminPanel.jsx`** — currently a fully mock page (hardcoded user array with duplicate entries, no
  Firestore connection, action icons have no handlers), but it's reachable by anyone via `/adminpanel`
  with zero gating in the component itself.
- **`GroupSelectorRenamer.jsx:62,67`** — hardcodes the literal collection name `'territories'` instead of
  going through `COLLECTIONS.TERRITORIES`. A user working in test mode who uses this tool silently
  renames/overwrites documents in the **production** collection.
- **`firebase.jsx:13,21`** — Firebase config and a Google Maps API key are hardcoded in source rather
  than environment variables. Firebase web config isn't secret by itself, but shipping it un-templated
  makes per-environment (test/staging/prod) config impossible, and the unrestricted Maps key is a
  billing-abuse risk if it lacks HTTP-referrer restrictions in the Google Cloud console (worth confirming
  there, since that's outside the repo).

### Correctness Bugs

- **`grupoContext.jsx:259-281` (`saveFolioRecord`) + `FolioTable.jsx:43,97`** — new folio records are
  created with a literal `id: null` field (`FolioTable.jsx`'s modal state). The "create" branch of
  `saveFolioRecord` spreads `record` without stripping `id`, so `id: null` is written into the new Firestore
  document alongside its real auto-generated ID. On read-back, `grupoContext.jsx:123-127` does
  `{ id: doc.id, ...doc.data() }` — spreading `doc.data()` *after* `id: doc.id` — so the stored `id: null`
  overwrites the real ID in app state. Concrete failure: editing that record again always takes the
  "create" branch (duplicating instead of updating), and its delete button never renders
  (`FolioTable.jsx:346`'s `{assign.id && ...}` guard is false).
  ```js
  // grupoContext.jsx — create branch doesn't strip id before spreading
  await setDoc(newDocRef, { ...record, grupo: record.grupo || nombreGrupo, createdAt: serverTimestamp() });
  ```
- **`_utils.js:8,103,199,275,355,439,567,640`** — every group in the live, imported `territorios` data
  hardcodes the same map image:
  ```js
  imagen: new URL('./../assets/territorio-mejia.png', import.meta.url).href,
  ```
  Correctly-varied filenames (`territorio-jara.png`, `territorio-murillo.png`, etc.) exist further down in
  the file (lines 1601-2280) but only inside dead `RESTART_DATA_FOR_GROUP_S13_*` exports that nothing
  imports. Result: "Ver Mapa General" shows Mejía's map for every group except Mejía.
- **`_utils.js`** — the same `new URL('./../assets/...')` calls resolve, relative to
  `src/components/utils/_utils.js`, to a nonexistent `src/components/assets/` path (real assets live at
  `src/assets/`, two levels up). `vite build` prints "doesn't exist at build time" for each one. It only
  *appears* to work today because `GroupSelector.jsx:53-57` strips a `localhost:<port>` prefix off the
  broken URL — a regex that will do nothing once deployed to a real domain, since the URL will contain
  the production host, not `localhost`. These two bugs currently mask each other; fixing one without the
  other will change (not necessarily fix) what's on screen.
- **`grupoContext.jsx:130-135` and `PDFVisualizer.jsx:74`** — dates are stored as `MM/DD/YYYY` strings
  and sorted with `localeCompare`, which is lexicographic, not chronological:
  ```js
  recordsForTerr.sort((a, b) => (a.fechaInicio || '').localeCompare(b.fechaInicio || ''));
  ```
  `"12/01/2024"` sorts after `"01/01/2025"` even though it's earlier — any territory whose assignment
  history spans a year boundary gets the wrong "last completed" date on the printed PDF and in-app.
- **`grupoContext.jsx:162,217`** — `user.displayName.split(' ')[1]` assumes every display name has a
  space. A single-word name produces the literal string `"J. undefined"`, which gets persisted to
  Firestore as the assignee/publisher.
- **`GroupSelectorRenamer.jsx`** — `changeDocumentId` copies a document to a new ID and immediately
  deletes the original, with **no confirmation prompt** (every other destructive action in the app uses
  `window.confirm`) and **no collision check** — typing an existing group's name as the new ID silently
  overwrites it. It also fights `grupoContext.jsx`'s own logic: that context's `onSnapshot` on the old
  doc ID will see it's been deleted and immediately re-create a blank default document at the old ID,
  effectively undoing the rename for anyone with that group open.
- **`PredicacionEditor.jsx:11` / `PredicacionView.jsx:8`** — `import { db } from "../firebase";` is wrong;
  `firebase.jsx` is a sibling in the same directory, not a parent (every other file correctly uses
  `'./firebase'`). This is currently latent since neither file is routed yet, but it will hard-fail the
  build the moment a route is added.
- **`PredicacionEditor.jsx:274-275`** — "Generar próximos 3 meses" always writes `lugar: "", asignado: ""`
  in its `setDoc(..., { merge: true })` call. `merge: true` only protects *omitted* fields — since these two
  are explicitly included as empty strings, re-running the generator wipes out any manually-entered
  `lugar`/`asignado` values for every Saturday in range.
- **`PdfEditor.jsx:46,73,80,82`** (unrouted, but noted for when it's revisited) — assumes
  `dataPDF.pages` exists; the actual context shape (`grupoContext.jsx:313`, `{ name, mapa: { imagen, area } }`)
  has no `.pages`, so this throws and the component is stuck on "Cargando..." forever with the error only
  logged to console.
- **`FolioTable.jsx:404`** — `parseInt(val) || 1` turns a typed `"0"` (or a cleared field) into `1` silently,
  since `0` is falsy — likely not the intended default.
- **`PDFPageInfoEdit.jsx:39-47`** — `updateTerritory`/`updateAssignment` shallow-copy the array but mutate
  the nested object/array in place before calling `setState`:
  ```js
  const updated = [...territories];
  updated[index][field] = value;   // mutates the previous state's object directly
  setTerritories(updated);
  ```

### Loading Performance & React Anti-Patterns

- **`grupoContext.jsx:319-337`** — the context's `<Provider value={{...}}>` is a fresh object literal every
  render, with no `useMemo`/`useCallback` anywhere in the file. Every snapshot update (including things as
  unrelated as the online/offline flag) re-renders every consumer (`NavbarApp`, `GroupSelector`,
  `FolioTable`, `Home`) even when they only read one unrelated field.
- **`Home.jsx:29`** — destructures `folioRecords` and `territorioActivo` from context but never uses either
  (only `nombreGrupo` is read) — so `Home` re-renders on every folio/territory snapshot for no visible
  reason, compounding the point above.
- **`grupoContext.jsx:148-189` (`toggleManzanaStatus`)** — recomputes the *entire* `manzanas` array from a
  client-side snapshot and writes it back as a full-array replace rather than a targeted field update. Two
  users toggling different manzanas in the same area within the snapshot round-trip window will race —
  the second write overwrites the first's change using its own stale copy.
- **`FolioTable.jsx:70-71`** — `folioRecords` is fetched from Firestore filtered only by `grupo`
  (`grupoContext.jsx:121`, `where("grupo", "==", nombreGrupo)`), pulling the group's **entire** folio
  history across all years; the service-year filter is then applied client-side. As folio history
  accumulates, every session downloads years of data it immediately throws away.
- **`PredicacionEditor.jsx:152-232`** — every keystroke in a schedule field fires its own `setDoc` (no
  debounce, no local buffering of the input value). Typing a 12-character name issues 12 separate
  Firestore writes, and because the displayed value is derived purely from the `onSnapshot` echo (not a
  local `useState`), fast typing can race: writes can resolve out of order and the persisted value doesn't
  necessarily match the last character typed.
- **`PredicacionEditor.jsx:241-282`** — bulk-creates up to ~13 Saturday documents via a sequential
  `await`-in-loop of individual `setDoc` calls instead of a single `writeBatch` (which the codebase already
  uses elsewhere, `grupoContext.jsx`'s `bulkUpdateFolioRecords`).
- **`PDFVisualizer.jsx:186-247`** — the PDF-generation effect has no cleanup/cancellation. Switching groups
  before a previous `generatePDF()` finishes races two async runs; whichever's blob URL loses the race is
  never revoked — a real leak on rapid group-switching, plus no revoke at all on unmount.
- **`PDFCanvasViewer.jsx:12-48`** — same shape of bug: no cancellation flag, so a `pdfUrl` change mid-render
  interleaves a stale render's `appendChild` calls with the new one's, and `loadingTask`/render tasks are
  never cancelled or destroyed on unmount.
- **`PdfEditor.jsx:28-35`** — `setDataPDF(dataDeGrupo)` runs inside an effect whose dependency array is
  `[dataPDF]` — since `dataDeGrupo` gets a new reference on every Firestore snapshot, this effect
  re-triggers itself once extra per real data change, duplicating the PDF fetch/generate/leak.
- Array index used as list `key`: `GroupSelector.jsx:460`, `PDFPageInfoEdit.jsx:125,177`. Low risk today
  (no reordering), but a existing anti-pattern worth cleaning up opportunistically.

### Test Coverage

There is no test infrastructure in this project at all — no `vitest`/`jest`/`@testing-library` in
`package.json`, no `*.test.*`/`*.spec.*` files, and no `.github/workflows`. Nothing is enforced in CI
because there is no CI. This means every finding above has to be caught by manual QA; there's no
regression safety net for the data-layer bugs (the `id: null` bug in particular is the kind of thing a
single integration test around `saveFolioRecord`/`getFolioRecords` would have caught immediately).

### Other Notable Issues (dead code / drift)

- **`_utils.js:734-2814`** — roughly 2,080 lines (71% of the file) are exported constants
  (`doc_S13_S_data`, all eight `RESTART_DATA_FOR_GROUP_S13_*` objects) that nothing in `src/` imports
  (verified by grep for each symbol). This is the single largest chunk of dead code in the repo.
- **`_utils.js:1-2`** — `import { complex } from "framer-motion";` and `import { newlineChars } from "pdf-lib";` are unused.
- **`grupoContext.jsx:294-331`** — `bulkUpdateFolioRecords` is exported but never called anywhere.
- **`AdminPanel.jsx`** — dead `useEffect` import, large commented-out import blocks from an earlier version.
- **`PdfEditor.jsx`** — not routed/imported anywhere; if it's meant to be superseded by `PDFVisualizer.jsx`,
  delete it rather than leave a second, broken implementation of the same feature around. Also has an
  unescaped download filename bug (`download="{nombreGrupo}.pdf"` — literal braces, not a template
  literal, compare `PDFVisualizer.jsx:334`'s correct `` download={`S-13-S_${nombreGrupo}_${adjustedYear}.pdf`} ``).
- **`utils/pdfWorker.js`** — entirely dead; nothing imports it. `PDFCanvasViewer.jsx` wires up the pdf.js
  worker a different way, directly against a manually-copied `public/pdf.worker.js` with no automated
  mechanism keeping it in sync with future `pdfjs-dist` upgrades.
- **`PDFPageInfoEdit.jsx`** — despite living next to the `pdf-lib`-based generator and being routed at
  `/pdfpageinfoedit`, "Generar PDF" (line 50-52) just calls `window.print()` — it never produces an
  actual PDF, and unlike every other data-bearing page in the app it has zero persistence (no Firebase,
  no localStorage): a full form is lost on refresh. Worth deciding whether this route is meant to be an
  abandoned duplicate of `PDFVisualizer` or something else.
- **`LoginPage.jsx:48-56`** — "Login con email" / "Nuevo Usuario" buttons have no click handler at all.
- **`LoginPage.jsx:11-19`** — because `loginWithGoogle`/`loginWithOutlook` swallow all errors
  (`AuthProvider.jsx`), `navigate('/home')` fires even when the login popup is closed/blocked/fails —
  the user gets redirected as if logged in with no `user` actually set.
- **`Home.jsx:45-65,81-169,429-532`** — a ~19-entry "do-not-preach" list (with real address/behavior notes)
  is hardcoded directly in the component instead of coming from Firestore like every other data type in
  the app, and ~190 lines of a previous UI (search bar, stats cards, activity timeline) are commented out
  rather than deleted.
- **`GroupSelectorRenamer.jsx`** — three fully commented-out functions and two pieces of dead state
  (`selectedTerritory`, `territoriosState`) that nothing updates.
- **`PDFVisualizer.jsx:7`, `GroupSelector.jsx:3-5`** — `Card`/`CardBody`/`Progress` imported from
  `@heroui/react` but never rendered (hand-rolled `<section>`/`<div>` markup used instead).
- Pervasive `console.log`/`console.error` (many emoji-prefixed) across `grupoContext.jsx`,
  `AuthProvider.jsx`, `GroupSelector.jsx`, `GroupSelectorRenamer.jsx`, `PdfEditor.jsx` — none gated behind
  a dev-only check, all shipping to the production console.
- **`PredicacionEditor.jsx` / `PredicacionView.jsx`** duplicate `getSaturdays`, `getThreeMonths`, the
  `MESES` array, and the `DIAS_SEMANA` array verbatim between the two files — worth a shared util now,
  while both are still being actively written.
- **Data-model drift**: `mockForPDF.json` / `alldatafromFirebaseFolio.json` reflect a legacy
  `{ pages: [{ columns: [{ rows }] }] }` shape that `PdfEditor.jsx` and a dead fallback branch in
  `PDFVisualizer.jsx:93-112` are still written against, but the live context shape
  (`grupoContext.jsx:313`) is `{ name, mapa: { imagen, area } }`. This mismatch is the root cause of both
  the `PdfEditor.jsx` crash and the unreachable `PDFVisualizer.jsx` fallback.

---

## Recommendations

### Quick Wins
1. **Make `IS_TEST_MODE` derive automatically instead of relying on remembering to toggle it by hand**,
   e.g. `export const IS_TEST_MODE = import.meta.env.DEV;` (true for `vite dev`/local, false for
   `vite build`), or a `.env`-backed `VITE_TEST_MODE` set once per environment file. Either removes the
   "did I flip it back before deploying" step entirely. If you want a belt-and-suspenders check on top
   of that, a one-line guard in `firebase.jsx` that throws or `console.error`s loudly when
   `import.meta.env.PROD && IS_TEST_MODE` would catch a bad build before it's deployed rather than after.
2. **Stop granting `admin` on signup.** Default new users to `roles: ["user"]` and add a separate,
   manually-driven promotion path (even just an admin editing the Firestore doc directly is safer than
   automatic).
3. **Fix the `id: null` bug**: in `FolioTable.jsx`, don't include `id` in the initial/reset modal state
   (use `{ ...blankRecord }` without an `id` key, or `id: undefined`), and in `grupoContext.jsx`'s
   `saveFolioRecord` create-branch, destructure `id` out before spreading: `const { id, ...rest } = record;`
   then `setDoc(newDocRef, { ...rest, ... })`. Also swap the read-back order to
   `{ ...doc.data(), id: doc.id }` so a stray stored `id` can never win over the real one.
4. **Fix the map-image bug** in `_utils.js` by pulling each group's correct filename from the already-correct
   (but currently dead) data further down the file, and fix the relative path (`./../assets/` → `../assets/`
   relative to `src/components/utils/_utils.js` should be `../../assets/`) — verify with `vite build` that the
   "doesn't exist at build time" warning disappears.
5. **Delete the ~2,080 dead lines** in `_utils.js` (`doc_S13_S_data`, all `RESTART_DATA_FOR_GROUP_S13_*`)
   once you've salvaged the correct image filenames from them, plus `bulkUpdateFolioRecords`
   (`grupoContext.jsx`) and `utils/pdfWorker.js` if nothing is meant to adopt it.
6. **Fix `PredicacionEditor.jsx`/`PredicacionView.jsx`'s import path**: `../firebase` → `./firebase`.
7. **Fix `PredicacionEditor.jsx`'s merge bug**: only include `lugar`/`asignado` in the `setDoc` payload when
   generating a *new* Saturday doc, or read the existing doc first and preserve non-empty values before
   regenerating.
8. **Add a role check to the admin/renamer routes and nav links** (`NavbarApp.jsx`, `App.jsx`): even a
   simple `user?.roles?.includes('admin')` gate on the route element is a meaningful improvement until
   Firestore rules exist.
9. **Add a `window.confirm` to `GroupSelectorRenamer.jsx`'s rename/delete action**, and check for an
   existing document at `newId` before overwriting it.
10. Wire the two dangling buttons in `LoginPage.jsx` ("Login con email", "Nuevo Usuario") or remove them if
    not implemented yet, and surface login errors to the UI instead of navigating on failure regardless.

### Structural Improvements
1. **Write a `firestore.rules` file.** This is the actual authorization boundary — client-side role
   checks are a UX nicety, not security, since any authenticated user can call Firestore directly. At
   minimum: restrict `folio_records`/`territories` writes to users with `roles` containing `admin` (or
   scope to the assigned user for their own records), and lock `users/{uid}.roles` so a user can't
   self-promote via `updateUserData`.
2. **Memoize the `DatosGrupoProvider` context value** (`useMemo` around the value object, `useCallback`
   around each handler) so unrelated state changes (e.g. `isOnline`) don't re-render every consumer.
   Combine with splitting the single context into smaller ones (e.g. territory data vs. folio records vs.
   connectivity) if particular consumers only need a slice.
3. **Move `casasNoPredicar` (`Home.jsx`) into Firestore** like every other data type in the app, so it can
   be edited without a redeploy — likely also warrants an access-control look given it contains
   addresses/behavior notes about specific households.
4. **Introduce a proper date type/helper** instead of `MM/DD/YYYY` strings compared with `localeCompare` —
   either store as Firestore `Timestamp`/ISO strings, or add one shared `compareDates(a, b)` util and use
   it everywhere dates are sorted (`grupoContext.jsx`, `PDFVisualizer.jsx`).
5. **Debounce/local-buffer the predicación schedule inputs**: keep a local `useState` for the raw input
   value, and only fire the Firestore write on blur or after a debounce interval — this also resolves the
   keystroke race and cuts write volume dramatically.
6. **Batch the 3-month Saturday generation** (`PredicacionEditor.jsx`) with `writeBatch` instead of a
   sequential loop of individual `setDoc` calls.
7. **Add cancellation/cleanup to the PDF-rendering effects** (`PDFVisualizer.jsx`, `PDFCanvasViewer.jsx`,
   `PdfEditor.jsx` if kept): a `let cancelled = false` flag checked before each `setState`/`appendChild`,
   returned as the effect's cleanup, plus revoking any blob URL created by a run that loses the race.
8. **Add server-side filtering for `folioRecords` by service year** in the Firestore query
   (`grupoContext.jsx`), instead of downloading the group's entire history and filtering client-side in
   `FolioTable.jsx`.
9. **Decide the fate of `PDFPageInfoEdit.jsx` and `PdfEditor.jsx`** — both look like earlier iterations of
   what `PDFVisualizer.jsx` now does. If superseded, delete them (and their routes); if intentionally kept
   as a different workflow, at least give `PDFPageInfoEdit.jsx` persistence so users don't lose a filled-in
   form on refresh.
10. **Set up minimal test infrastructure**: `vitest` + `@testing-library/react` (Vite-native, low setup
    cost), starting with the data-layer functions in `grupoContext.jsx`/`_utils.js` — these are exactly
    the functions where the `id: null` bug lived, and a single test around
    `saveFolioRecord`/round-trip-read would have caught it.

### Larger Investments / Open Questions
1. **Real-time collaborative editing semantics.** `toggleManzanaStatus`'s full-array read-modify-write
   pattern will keep losing concurrent edits as more people use the app simultaneously on the same
   territory. Worth deciding whether manzana-level documents (one doc per manzana, or an atomic
   `arrayUnion`-style update) are worth the migration, given this app's real usage is presumably a small
   group of publishers editing concurrently during field service.
2. **Multi-environment config.** Right now "test mode" is a single hardcoded boolean with no notion of
   dev/staging/prod. Worth deciding on a real strategy (separate Firebase projects per environment via
   `.env` files + Vite's `import.meta.env`, or Firebase Hosting channels) rather than one flag switching
   collection name suffixes within the same project.
3. **Which PDF-generation path is canonical?** Three different components (`PDFVisualizer.jsx`,
   `PdfEditor.jsx`, `PDFPageInfoEdit.jsx`) implement overlapping/competing approaches to producing the same
   S-13-S form. Consolidating to one (`PDFVisualizer.jsx` looks the most complete and is the one actually
   linked from routes users can reach) would remove a whole category of "which one is actually used"
   confusion for future changes.
4. **What are the last-4-assignments and territory-count rules actually supposed to do?**
   `PDFVisualizer.jsx` prints only the oldest 4 assignments per territory (not the most recent 4), and
   only prints as many territories as the *current* live count, silently dropping historical records for
   territories that have since been removed/renumbered — worth confirming intended behavior with whoever
   owns the S-13-S form requirements before "fixing" it either way.
