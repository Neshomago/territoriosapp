# React Code Review — `territoriosapp`

**Stack:** React 18 · Vite + SWC · React Router v6 · Firebase v10 · HeroUI · Tailwind CSS · pdf-lib · framer-motion  
**Scope:** Full app — all components, contexts, routing  
**Pain point:** Speed optimization + correctness

---

## Summary

The app is a functional territory-management PWA. The overall structure is reasonable for a small internal tool, but it carries several **critical bugs** that can silently corrupt Firebase data and cause runtime crashes. The biggest concerns are: **stale state in `setTimeout` patches writing to Firebase, `setTerritories` called on an undeclared function, missing `key` on Fragment lists, and missing imports for `deleteDoc` / `updateDoc`**. Performance-wise, the main bottleneck is that **the entire `_utils.js` (137 KB of static territory data) is eagerly imported in every component**, and Firebase is called on every single checkbox tick. Addressing those two issues will produce the biggest perceived speed improvement.

---

## 🔴 Critical Issues

### C1. `setTimeout` reads stale `selectedTerritory` — data corruption
**File:** `GroupSelector.jsx` — `handleCheckboxChange` (line 113) and `handlerRestartTerritories` (line 178)

The checkbox handler calls `setSelectedTerritory(fn)` (async), then fires a `setTimeout` that reads `selectedTerritory` from the closure — which is still the **old** value. On any device with a slow render cycle, this overwrites Firebase with stale data.

```jsx
// BEFORE (buggy)
setSelectedTerritory((prev) => { ...mutations...; return updated; });
setTimeout(async () => {
  await actualizarFirebase(selectedTerritory); // ← OLD value from closure!
}, 20);

// AFTER — use the computed value directly
setSelectedTerritory((prev) => {
  const next = { ...prev };
  // ...mutations...
  actualizarFirebase(next); // pass the new state — no setTimeout needed
  return next;
});
```

> **This is the most dangerous bug in the app.** A slow mobile device will trigger it reliably, silently reverting checkbox progress in Firebase.

---

### C2. `setTerritories` called but never declared — runtime crash
**File:** `AuthProvider.jsx` — `loadTerritories` (line 121)

`setTerritories(territorySnapshot.data())` is called but there is no `const [territories, setTerritories] = useState(...)` in `AuthProvider`. Throws `ReferenceError` at runtime for any user who has no territories document.

**Fix:** Either add `const [territories, setTerritories] = useState(null)` to `AuthProvider`, or remove `loadTerritories` — the data it loads is never consumed by any component.

---

### C3. `updateDoc` imported in `AuthProvider` — missing import
**File:** `AuthProvider.jsx` — line 135

`updateDoc(territoryDocRef, ...)` is called but `updateDoc` is not in the import on line 8.

```js
// Fix
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
```

---

### C4. `deleteDoc` used but never imported — runtime crash
**File:** `GroupSelectorRenamer.jsx` — line 71

`deleteDoc(docRef)` is called but not imported.

```js
// Fix
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
```

---

### C5. Missing `key` on Fragment in list — reconciliation bugs
**File:** `GroupSelector.jsx` — line 314

Shorthand `<>...</>` inside `.map()` cannot receive a `key` prop. React cannot correctly reconcile this list.

```jsx
// BEFORE
.map(([areaKey, area]) => (
  <>   {/* no key */}
    <Divider />
    ...
  </>
))

// AFTER
.map(([areaKey, area]) => (
  <React.Fragment key={areaKey}>
    <Divider />
    ...
  </React.Fragment>
))
```

---

### C6. `sessionStorage.setItem('user', user)` stores `[object Object]`
**File:** `AuthProvider.jsx` — lines 65 and 107

Passing a Firebase `User` object to `sessionStorage.setItem` stores the useless string `"[object Object]"`. The value is never read back — simply remove these two lines.

---

### C7. Variable shadowing crash in `getDataDeGrupo` catch block
**File:** `grupoContext.jsx` — line 38

The catch block catches `error` but logs `err` — a `ReferenceError` that masks the real error.

```js
// BEFORE
} catch (error) {
    console.error("Error fetching group data:", err); // ReferenceError!
}

// AFTER
} catch (error) {
    console.error("Error fetching group data:", error);
}
```

---

### C8. Login navigation runs even when login fails
**File:** `LoginPage.jsx` — `handleLogin` (line 11), `handleMsLogin` (line 16)

If `loginWithGoogle()` throws (popup blocked, wrong account), `navigate('/home')` still executes, sending the user to a protected route with `user = null`, triggering an infinite redirect loop.

```jsx
// AFTER
const handleLogin = async () => {
    try {
        await loginWithGoogle();
        navigate('/home');
    } catch {
        // loginWithGoogle already logs the error internally
    }
};
```

---

## 🟡 Warnings

### W1. `useEffect` missing `getDataDeGrupo` in deps
**File:** `PDFVisualizer.jsx` — line 121

```jsx
useEffect(() => {
    if (nombreGrupo) getDataDeGrupo(nombreGrupo);
}, [nombreGrupo]); // ← getDataDeGrupo missing
```

Add `getDataDeGrupo` to the array and memoize it with `useCallback` in the context provider.

---

### W2. Blob URL memory leak on unmount
**File:** `PDFVisualizer.jsx` — line 134

`URL.revokeObjectURL(pdfUrl)` is called inside the effect body, not in a cleanup function. If the component unmounts mid-generation, the blob URL leaks.

```jsx
// AFTER — correct cleanup pattern
useEffect(() => {
    let activeUrl = null;
    const run = async () => {
        // ...generate PDF...
        activeUrl = URL.createObjectURL(blob);
        setPdfUrl(activeUrl);
    };
    run();
    return () => { if (activeUrl) URL.revokeObjectURL(activeUrl); };
}, [dataDeGrupo, nombreGrupo]);
```

---

### W3. `getAuth()` called twice — redundant singleton
`firebase.jsx` already exports `auth = getAuth()`. `AuthProvider.jsx` calls `getAuth()` again on every render (line 16). Use the exported `auth` singleton instead.

---

### W4. `loading` state never reset in `GroupSelector`
`setLoading(true)` is called in `handleSetGrupo`, but never reset to `false` after `fetchSelectedTerritory` resolves. The `loading` flag stays `true` forever — the spinner only disappears because `selectedTerritory` becomes truthy. Add `setLoading(false)` at the end of `fetchSelectedTerritory`.

---

### W5. `div` imported from `framer-motion/client` — unused import
**File:** `GroupSelector.jsx` — line 16

```jsx
import { div } from 'framer-motion/client'; // remove
```

This pulls `framer-motion` into the `GroupSelector` bundle chunk for no reason.

---

### W6. `data` imported from `autoprefixer` — wrong package
**File:** `PDFVisualizer.jsx` — line 10

```jsx
import { data } from "autoprefixer"; // remove — autoprefixer is a PostCSS plugin
```

---

### W7. Nav handlers wrapped in `async` unnecessarily
**File:** `Home.jsx` line 18, `FooterNavbar.jsx` lines 13–24

`navigate(...)` is synchronous. Wrapping it in `async` is misleading.

---

### W8. Checkbox uses array index as `key`
**File:** `GroupSelector.jsx` — line 375

```jsx
area.manzanas.map((item, index) => <Checkbox key={index} ...>)
```

If manzanas are ever reordered or filtered, checkbox states will be misattributed. Use `item.name` instead.

---

### W9. `user.horario` and `user.territorio` always `undefined`
**File:** `Home.jsx` — line 181

Firebase Auth's `user` object does not carry `horario` or `territorio` — these fields live in Firestore under `users/{uid}`. This expression always falls back to the default string. The Firestore profile needs to be fetched separately and stored as `userProfile` state in `AuthProvider`.

---

### W10. `.then()` mixed with `await` inside an `async` function
**File:** `grupoContext.jsx` — line 217

```js
// BEFORE — inconsistent
const segundoObjeto = await getDoc(...).then(snap => snap.data());

// AFTER — consistent
const snap = await getDoc(...);
const segundoObjeto = snap.data();
```

---

### W11. Dropdown items in `NavbarApp` have no `onPress` handlers
`"Revisar PDF"` and `"Cerrar Sesión"` items render but do nothing. Wire them or remove them.

---

## 🔵 Info / Style

- **Dead commented-out code in 6 files** — `AuthProvider`, `PDFVisualizer` (entire old drawing block), `AdminPanel`, `FooterNavbar`, `GroupSelectorRenamer`, `GroupSelector`. Tracked in git — delete them.
- **30+ `console.log/warn` in production paths** — Across `GroupSelector`, `grupoContext`, `PDFVisualizer`. Remove or wrap behind a `DEBUG` env flag.
- **Mixed default/named export convention** — `LoginPage` and `NavbarApp` use `export default`; all others use `export const`. Pick one.
- **`AuthUserService.jsx`** — exists in `/components` but is not imported anywhere. Use it or delete it.
- **`FolioTable.jsx`** — 0-byte empty file. Delete.
- **3 PDF files in `/src/components/`** — `S-13-S.pdf`, `S-13_S copy.pdf`, `S-13_S.pdf` (153 KB total). They belong in `/public/` (where `PDFVisualizer` already fetches them) and should be added to `.gitignore`.
- **`alldatafromFirebaseFolio.json` (130 KB) and `mockForPDF.json` (14 KB)** — dev data dumps committed to the repo. Remove.

---

## Redundancies

### R1. Duplicate login flow (Google vs Outlook)
`loginWithGoogle` and `loginWithOutlook` share ~25 lines of identical post-login logic. Extract:

```jsx
const handlePostLogin = async (user) => {
    const ref = doc(db, "users", user.uid);
    if (!(await getDoc(ref)).exists()) {
        await setDoc(ref, { name: user.displayName, email: user.email, roles: ["user"], createdAt: new Date(), territorio: '', horario: '' });
    }
    setUser(user);
};

const loginWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
    await handlePostLogin(user);
};
```

---

### R2. Territory `<Select>` duplicated in 3 components
`GroupSelector`, `GroupSelectorRenamer`, and `PDFVisualizer` all render the identical territory dropdown. Extract to `<TerritorySelect onChange={fn} />`.

---

### R3. Two date formatters doing the same job
`formatDate` (line 133) and `formatearFecha` (line 196) in `GroupSelector.jsx` both produce `MM/DD/YYYY` strings from different input types. Consolidate into one utility function.

---

### R4. `userObject` string computed in 4 places
```jsx
`${user.displayName[0]}. ${user.displayName.split(' ')[1]}`
```
Computed in `AuthProvider` (×2), `GroupSelector`, and `grupoContext`. Extract to `utils/formatUserDisplayName.js`.

---

### R5. `_utils.js` (137 KB) imported everywhere — biggest performance bottleneck
Every component that shows territory names imports the **entire** `_utils.js`. Components that only need group names for the Select dropdown don't need the full geometry data.

**Quick win:**
- Split into `territoryNames.js` (just the keys, ~1 KB) and `territoryData.js` (full structure).
- Components using only the Select import `territoryNames` only.
- This alone will reduce initial JS bundle size significantly.

---

## Proposed Refactors

**Refactor: Extract `useFirebaseTerritory` custom hook**
Reason: `GroupSelector.jsx` is 431 lines mixing Firebase reads/writes, date logic, PDF routing, and progress calculation in one component.
Risk: Low | Behavior change: No

```jsx
// hooks/useFirebaseTerritory.js
const useFirebaseTerritory = (grupo) => {
    const [selectedTerritory, setSelectedTerritory] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async () => {
        if (!grupo) return;
        setLoading(true);
        const snap = await getDoc(doc(db, 'territories', grupo));
        if (snap.exists()) setSelectedTerritory(snap.data());
        setLoading(false);
    }, [grupo]);

    useEffect(() => { fetch(); }, [fetch]);
    return { selectedTerritory, setSelectedTerritory, loading };
};
```

---

**Refactor: Debounce Firebase writes on checkbox change**
Reason: Every checkbox tap fires one Firestore write — one network round trip per click. On mobile this causes visible lag.
Risk: Low | Behavior change: No (data still saved, ~500ms later)

```jsx
const saveTimerRef = useRef(null);

const handleCheckboxChange = (areaKey, index) => {
    setSelectedTerritory((prev) => {
        const next = computeNext(prev, areaKey, index);
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => actualizarFirebase(next), 500);
        return next;
    });
};

useEffect(() => () => clearTimeout(saveTimerRef.current), []);
```

---

**Refactor: Move `BrowserRouter` to the outermost position**
Reason: Standard convention is `BrowserRouter > AuthProvider > ...`. Currently the Router sits inside both providers, which prevents providers from using routing hooks if ever needed.
Risk: None | Behavior change: No

---

## Extensibility Notes

**Extensibility Note: Hard-coded page/column assignment in `saveRegistry`**
Current state: `columnaNum <= 5 ? 1 : 2` assumes exactly 10 territories, 5 per page.
Risk if a group has ≠ 10 territories: Data placed on wrong PDF page silently.
Suggested boundary: Drive page assignment from a group config object.

---

**Extensibility Note: No role enforcement on protected routes**
Current state: Every new user gets `roles: ["user","admin"]` and can navigate to `/adminpanel`.
Risk if real admin features ship: Any user has access.
Suggested boundary: Add `<AdminRoute>` wrapper that checks `userProfile.roles` from Firestore.

---

**Extensibility Note: `PDFPageInfoEdit` is disconnected from Firebase**
Current state: Fully local state — no reads or writes to Firestore.
Risk if the table needs to be shared across users: Requires full rebuild.
Suggested boundary: Accept `territories` and `onSave` as props so it can be driven from a Firebase-backed hook.

---

## What NOT to Change

- ✅ **`PrivateRoutes.jsx`** — Clean, idiomatic guard using `Outlet`. The `loading` check preventing redirect flicker is correct.
- ✅ **`handlerRestartTerritories` / `blankTerritories` as separate functions** — Good separation: blanking local state and writing to Firebase are kept as distinct steps.
- ✅ **`handlerGuardarFecha` try/finally pattern** — Correctly uses `finally` to reset per-area loading state even on error. 
- ✅ **`receivedDateHyphenFormat`** — Correct date format conversion (`MM/DD/YYYY` → `YYYY-MM-DD`) for HeroUI DatePicker. 
- ✅ **`DatosGrupoContext` design** — Reasonable use of Context for cross-route group state. Exposing `error` and `loading` separately in the value is good practice.
- ✅ **`adjustedYear` theocratic year logic** — `now.getMonth() >= 8 ? year + 1 : year` correctly computes the September start of the service year.
- ✅ **`unsubscribe()` cleanup in `AuthProvider` `useEffect`** — Firebase listener is correctly cleaned up on unmount.
- ✅ **`PDFVisualizer` mobile/desktop iframe split** — `esMovil` check with `PDFCanvasViewer` fallback is a practical solution for iOS's `<iframe>` limitation.
- ✅ **`calculateProgress` as a pure function** — Clean and correct.
- ✅ **`saveRegistry` duplicate-entry guard** — The `filaYaExiste` check prevents double-writing the same assignment to the folio.
- ✅ **`shouldCreateNewFirebasePage`** — Well-named clean predicate function.
