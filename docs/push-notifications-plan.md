# Push Notifications: Daily Territory Reminder — Implementation Plan

Status: **not implemented yet**. This is a ready-to-build spec, independent of whatever tool or
person implements it.

## Goal

Remind whoever is responsible for a given weekday's territory work if they haven't started it
by a fixed time, via a real OS-level push notification — one that arrives even if the app/browser
is completely closed.

## Hard platform constraint (read this first)

**iOS Safari cannot receive push notifications from a regular browser tab, at all.** This is an
Apple platform restriction (fixed since iOS 16.4), not something any amount of engineering can
work around. The only way an iPhone user can receive these pushes is if they first **"Add to Home
Screen"** (installing the site as a standalone PWA) — once installed, the standalone app can
request notification permission and receive push exactly like a native app. Android (Chrome,
Firefox, Edge) supports push from a regular open tab, no installation required.

Practical implication: **iOS users must install the app once** before "Activar notificaciones"
will do anything for them. There's no way to skip this step for iOS.

## Scope decision: weekdays only

The existing day→grupo territory mapping (see `TerritorioDelDiaCard.jsx`) only covers
Lunes–Viernes. Saturday's predicación arrangement is planned days/weeks in advance (via
"Generar próximos 3 meses" in `PredicacionEditor.jsx`), not something to flag as "forgotten"
same-day — so this reminder system covers **Lunes–Viernes only**. Extending it to Saturday later
is possible but is a distinct product decision (what does "forgot" even mean for a
pre-planned schedule?), not part of this spec.

## Data model additions

1. **`users/{uid}.fcmTokens: string[]`** — one Firebase Cloud Messaging registration token per
   device a user has granted permission on. Appended via `arrayUnion` (never overwritten wholesale
   — a person may have more than one device).
2. **New single-doc collection**, added to `COLLECTIONS` in `src/components/firebase.jsx`
   following the existing test-mode-aware pattern (e.g. `RESPONSABLES_DIA:
   IS_TEST_MODE ? 'responsables_dia_test' : 'responsables_dia'`). Exactly one document inside
   it, ID `schedule`, shaped:
   ```js
   { Lunes: "<uid>", Martes: "<uid>", Miércoles: "<uid>", Jueves: "<uid>", Viernes: "<uid>" }
   ```
   Five slots, no Sábado/Domingo. A day can be left unassigned (missing key) — the reminder
   function should simply skip that day if so, not error.

## Client changes

- **`public/manifest.json`** (new) + at least two icon sizes in `public/` + a
  `<link rel="manifest" href="/manifest.json">` in `index.html`. This is the minimum needed for
  "Add to Home Screen" to work on iOS at all — without a manifest, iOS won't offer a proper
  installable app.
- **`public/firebase-messaging-sw.js`** (new) — the service worker Firebase Cloud Messaging
  requires to show notifications while the app isn't in the foreground. It needs the same
  `firebaseConfig` object already in `src/components/firebase.jsx`, duplicated into this file
  (service workers run in a separate context and can't import app modules — this duplication is
  the standard, expected pattern for FCM web setup, not an oversight).
- **`src/components/firebase.jsx`**: initialize `getMessaging(app)`; export a
  `requestNotificationPermission()` helper that calls `Notification.requestPermission()`, then
  (if granted) `getToken(messaging, { vapidKey })`, then saves the resulting token onto the
  caller's own `users/{uid}` doc via `updateDoc(ref, { fcmTokens: arrayUnion(token) })`. Read the
  VAPID key from an env var (e.g. `VITE_FIREBASE_VAPID_KEY`) rather than hardcoding it — it's
  generated per-project in Firebase Console → Project Settings → Cloud Messaging → Web
  configuration → "Generate key pair", and needs to go into a local `.env` file (gitignored,
  consistent with how this project already keeps Firebase config out of source... actually note:
  today `firebase.jsx`'s config is hardcoded rather than env-driven — whoever implements this
  should decide separately whether to fix that at the same time or leave it as-is; not blocking
  for this feature either way).
- **`NavbarApp.jsx`**: one new dropdown item, "🔔 Activar notificaciones" (visible to any approved
  user — anyone could end up assigned as a día's responsable), calling
  `requestNotificationPermission()`. This reuses the existing dropdown menu rather than building a
  dedicated settings page.
- **Foreground messages** (a push arrives while the app is already open): handle with
  `onMessage(messaging, ...)` somewhere near the top of the app (e.g. `AuthProvider.jsx` or
  `App.jsx`), rendered as a simple message banner — reuse the existing banner pattern already used
  in `PredicacionEditor.jsx` rather than pulling in a toast library.

## Admin UI — `AdminPanel.jsx`

New "Responsables por día" section, same access tier as the rest of that page (manager+): five
rows (Lunes–Viernes), each a `<select>` populated from the same approved-users list already
fetched for the "Usuarios" table there. Selecting a name writes that user's uid into the relevant
key of the single `responsables_dia/schedule` document (`setDoc(ref, { [dia]: uid }, { merge: true
})`).

## Cloud Function (new `functions/` directory)

Requires the Firebase project to be on the **Blaze** (pay-as-you-go) plan — Cloud Functions do not
run at all on the free Spark plan, regardless of trigger type. This is an unavoidable cost/billing
decision, not an implementation detail.

Scaffold with `firebase init functions` (Node, `firebase-admin` + `firebase-functions`), and add a
`"functions"` block to `firebase.json`.

One scheduled function, e.g.:
```js
exports.dailyTerritoryReminder = onSchedule(
  { schedule: 'every day 17:00', timeZone: 'America/Bogota' },
  async () => {
    const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const hoy = dias[new Date().getDay()];
    if (hoy === 'Sábado' || hoy === 'Domingo') return;

    const scheduleDoc = await db.collection(RESPONSABLES_DIA).doc('schedule').get();
    const uid = scheduleDoc.data()?.[hoy];
    if (!uid) return;

    const GRUPO_POR_DIA = { Lunes: 'Murillo', Martes: 'Jara', Miércoles: 'Mosquera(mañana)', Jueves: 'Echeverría', Viernes: 'Villareal' };
    const grupoDoc = await db.collection(TERRITORIES).doc(GRUPO_POR_DIA[hoy]).get();
    const todayFormatted = formatDate(new Date()); // MM/DD/YYYY, same format used client-side
    const area = grupoDoc.data()?.mapa?.area || {};
    const yaIniciado = Object.values(area).some(a => a.fechaInicio === todayFormatted);
    if (yaIniciado) return; // already done today, nothing to remind

    const userDoc = await db.collection(USERS).doc(uid).get();
    const tokens = userDoc.data()?.fcmTokens || [];
    if (tokens.length === 0) return;

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: 'Recordatorio de territorio',
        body: `No has actualizado el territorio de hoy (${GRUPO_POR_DIA[hoy]}).`,
      },
    });

    // Prune any tokens FCM reports as invalid/unregistered.
    const staleTokens = response.responses
      .map((r, i) => (!r.success ? tokens[i] : null))
      .filter(Boolean);
    if (staleTokens.length > 0) {
      await db.collection(USERS).doc(uid).update({
        fcmTokens: admin.firestore.FieldValue.arrayRemove(...staleTokens),
      });
    }
  }
);
```
(The day→grupo mapping and date-formatting helper are re-derived here as small local constants —
Cloud Functions can't import client-side React files, so this is an intentional, small duplication
consistent with how this codebase already keeps small helpers per-file rather than over-abstracting.)

## Manual setup steps (cannot be scripted/automated)

1. Upgrade the Firebase project to the Blaze billing plan.
2. Generate the Web Push certificate (VAPID key) in Firebase Console → Cloud Messaging, add it to
   the client env config.
3. `firebase deploy --only functions` (and `firebase deploy --only hosting` for the manifest/service
   worker/icons).

## Verification checklist

1. Add the site to the home screen on an iOS device; confirm it opens standalone (no Safari
   chrome).
2. Click "Activar notificaciones" on both an installed iOS instance and a regular Android Chrome
   tab; confirm a token appears in that user's `users/{uid}.fcmTokens` in Firestore.
3. In AdminPanel, assign a test account as responsable for today's weekday.
4. Trigger the function manually (e.g. `firebase functions:shell`, or a temporary HTTPS-triggered
   copy for testing) instead of waiting for the scheduled time; confirm the push arrives on both
   platforms.
5. Start (check off at least one manzana in) today's territory, re-trigger the function, confirm
   it now exits early and does *not* send a duplicate reminder.
