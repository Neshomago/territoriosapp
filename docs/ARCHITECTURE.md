# TerritoriosApp — Documentación técnica

Referencia de arquitectura para quien retome este proyecto: qué hace, cómo está construido, cómo
fluyen los datos, y los patrones que ya están establecidos en el código. No duplica el contenido de
otros documentos del repo — los complementa:

- [`AUDIT.md`](../AUDIT.md) — auditoría de bugs y mejoras pendientes (código heredado).
- [`REACT_REVIEW.md`](../REACT_REVIEW.md) / [`error_learnings.md`](../error_learnings.md) — revisión y lecciones de una fase anterior del proyecto.
- [`CHANGELOG.md`](../CHANGELOG.md) — historial de cambios de una rama anterior.
- [`docs/push-notifications-plan.md`](push-notifications-plan.md) — spec lista para construir, aún no implementada.

## Resumen

Aplicación web para que una congregación gestione sus territorios de predicación puerta a puerta:
qué manzanas de cada territorio ya se recorrieron, el libro de registro histórico (formulario
S-13-S), el arreglo semanal/mensual de predicación, un directorio de lugares con enlace a Google
Maps, y un listado de casas que no deben visitarse (con foto). Todo con control de acceso por
niveles de rol y un flujo de aprobación para cuentas nuevas.

## Stack

| Capa | Tecnología |
|---|---|
| Build/dev server | Vite 5 + `@vitejs/plugin-react-swc` |
| UI | React 18, React Router v6, HeroUI (`@heroui/react`), Tailwind CSS |
| Backend | Firebase: Auth, Firestore (con caché local offline `persistentLocalCache`), Cloud Storage |
| PDF | `pdf-lib` (generación), `pdfjs-dist` (visualización) |
| Imágenes | `browser-image-compression` (compresión 100% en el navegador antes de subir) |
| Sin TypeScript, sin suite de tests, sin `firestore.rules` (control de acceso solo del lado del cliente) | |

## Estructura del repositorio

```
src/
  App.jsx                     Rutas y guardas de acceso
  main.jsx                    Punto de entrada (HeroUIProvider + StrictMode)
  components/
    AuthProvider.jsx           Contexto de sesión: Firebase Auth + perfil de Firestore + roles
    PrivateRoutes.jsx          Guarda de rutas (auth, aprobación, rol mínimo)
    PendingApproval.jsx        Pantalla para cuentas pendientes/rechazadas
    LoginPage.jsx               Login Google/Outlook (+ botones de prueba solo en dev)
    NavbarApp.jsx / FooterNavbar.jsx   Navegación, condicionada por rol
    Home.jsx                    Dashboard
    TerritorioDelDiaCard.jsx     Card "qué territorio toca hoy" (ver Flujos)
    GroupSelector.jsx           Ver/editar territorios y manzanas de un grupo
    GroupSelectorRenamer.jsx     Herramienta para renombrar/mover un documento de grupo
    FolioTable.jsx               Editor del libro mayor S-13-S
    PDFVisualizer.jsx / PDFPageInfoEdit.jsx / PdfEditor.jsx / PDFCanvasViewer.jsx   Generación/visualización de PDF
    PredicacionEditor.jsx        Editor del arreglo semanal/mensual + catálogo de lugares
    PredicacionView.jsx          Vista de solo lectura del arreglo de predicación
    CasasNoVisitarAdmin.jsx      Gestión de casas no visitar (con foto)
    ImagePreviewModal.jsx        Modal compartido para ver fotos en la misma app
    AdminPanel.jsx               Gestión de usuarios: aprobar/rechazar, asignar roles
    AuthUserService.jsx          Helpers puntuales de lectura/escritura sobre `users/{uid}`
    firebase.jsx                 Inicialización de Firebase + `COLLECTIONS` (modo prueba)
    contexts/grupoContext.jsx    Contexto de datos de territorios/folio del grupo seleccionado
    utils/
      _utils.js                  Datos semilla de territorios (plantilla, no la fuente de verdad)
      userAccess.js               Jerarquía de roles y helpers de permisos
      useRememberRoute.js          Recordar/restaurar la última ruta visitada
docs/
  ARCHITECTURE.md (este archivo)
  push-notifications-plan.md
```

## Arquitectura general

```mermaid
flowchart TB
  subgraph Cliente["SPA en el navegador (React + Vite)"]
    UI["Componentes / páginas"]
    AuthCtx["AuthProvider\n(sesión + perfil + rol)"]
    GrupoCtx["DatosGrupoProvider\n(territorios + folio del grupo activo)"]
  end

  subgraph FB["Firebase — proyecto territorioscongre-ce8ad"]
    Auth["Firebase Auth\n(Google / Outlook)"]
    FS[("Firestore\ncon caché offline")]
    ST[("Cloud Storage\n(fotos)")]
  end

  UI --> AuthCtx
  UI --> GrupoCtx
  AuthCtx <--> Auth
  AuthCtx <--> FS
  GrupoCtx <--> FS
  UI <--> ST
```

No hay backend propio: todo el acceso a datos ocurre directo desde el cliente contra el SDK de
Firebase. No existen reglas de seguridad de Firestore/Storage (`firestore.rules` no está en el
repo) — el control de acceso descrito abajo es **solo del lado del cliente**, ver
[`AUDIT.md`](../AUDIT.md) para el detalle de esa limitación.

## Modo prueba (`IS_TEST_MODE`)

`firebase.jsx` define `COLLECTIONS`, un mapa de nombre lógico → nombre real de colección. La
mayoría de las entradas cambian de sufijo según `IS_TEST_MODE`:

```js
TERRITORIES: IS_TEST_MODE ? 'territories_test' : 'territories',
```

`USERS` es la **única excepción** — siempre `'users'`, sin importar el modo, para que los roles y
el estado de aprobación sean los mismos en desarrollo y producción. `IS_TEST_MODE` se cambia a
mano antes de cada `firebase deploy` (no hay `predeploy` hook en `firebase.json`) — es el paso más
fácil de olvidar, revisar siempre antes de desplegar.

## Modelo de datos (Firestore)

| Colección | Forma (resumen) | Quién la usa |
|---|---|---|
| `users` | `{ name, email, role, status, createdAt, territorio, horario }` — perfiles legacy no tienen `role`/`status` (ver Roles) | `AuthProvider`, `AdminPanel` |
| `territories` | Un doc por grupo (`Murillo`, `Jara`, …): `{ name, mapa: { imagen, area: { [key]: { name, fechaInicio, fechaFin, user, manzanas: [{name, completed}] } } } }` | `GroupSelector`, `TerritorioDelDiaCard`, `CasasNoVisitarAdmin` |
| `folio_records` | Un doc plano por asignación histórica: `{ grupo, territorioNumero, publicador, fechaInicio, fechaFin, yearServicio, completado }` | `FolioTable`, `PDFVisualizer` |
| `arregloPredicacion` | Docs `semanal_*` (`{ tipo:'semanal', dia, horario, lugarId, asignado }`) y `mensual_*_{orden}` (`{ tipo:'mensual', dia, orden, grupos, lugarId, asignado }`) — un sábado puede tener 1 o 2 `orden` (ver Flujos) | `PredicacionEditor`, `PredicacionView`, `TerritorioDelDiaCard` |
| `lugares_predicacion` | `{ nombre, mapsUrl }` | `PredicacionEditor` (CRUD), `PredicacionView`/`TerritorioDelDiaCard` (lookup por `lugarId`) |
| `casas_no_visitar` | `{ etapa, mz, villa, ref, fecha, grupo, territorioKey, manzanaName, imagenUrl }` — `etapa`/`mz` son legado (ver abajo); `grupo`/`territorioKey`/`manzanaName` vinculan a un territorio real | `CasasNoVisitarAdmin` (CRUD), `Home`, `GroupSelector`, `TerritorioDelDiaCard` (lectura) |

**Nota sobre `casas_no_visitar`**: los 19 registros originales (hardcodeados antes en `Home.jsx`)
usan una numeración de "etapa" que no corresponde al modelo actual de grupo/territorio/manzana —
se migraron con los campos de vínculo en blanco, para completarlos manualmente desde
`CasasNoVisitarAdmin.jsx` según se van identificando.

Cada colección (salvo `users`) usa datos independientes en modo prueba — al desplegar con
`IS_TEST_MODE = false`, `lugares_predicacion`/`arregloPredicacion`/`casas_no_visitar` reales
empiezan vacíos hasta que se cargan datos reales desde la app ya desplegada.

## Sistema de roles y aprobación

```mermaid
flowchart BT
  U["user\nDashboard + Predicación (solo lectura)"] --> A["admin\n+ Territorios, Folio, PDF, Editor de Predicación, Casas No Visitar"]
  A --> M["manager\n+ AdminPanel: aprobar/rechazar cuentas, asignar roles hasta 'manager'"]
  M --> S["superuser\n+ puede asignar/quitar 'manager' y 'superuser'"]
```

Reglas clave (`utils/userAccess.js`):
- **Perfiles legacy** (creados antes de este sistema, sin `status`/`role`): se tratan como
  **aprobados** y con rol **`admin`** si su antiguo campo `roles` incluía `"admin"` — así ninguna
  cuenta existente queda bloqueada por la migración.
- **Cuentas nuevas**: `AuthProvider.ensureUserDoc` crea el perfil con `role:'user', status:'pending'`
  — sin acceso hasta que un `manager`/`superuser` lo apruebe desde `AdminPanel`.
- `canAssignRole`: un `manager` puede asignar cualquier rol hasta `manager` inclusive, pero nunca
  puede tocar a alguien que ya es `superuser` ni asignar ese rol — solo un `superuser` puede crear
  o modificar a otro `superuser`.

## Rutas y guardas de acceso

`PrivateRoutes.jsx` recibe una prop `minRole` (por defecto `'user'`) y se reutiliza en tres bloques
de rutas dentro de `App.jsx`:

```mermaid
flowchart TD
  Req["Solicitud de ruta"] --> Auth{"¿Autenticado?"}
  Auth -- No --> Login["/login"]
  Auth -- Sí --> Approved{"¿Perfil aprobado?"}
  Approved -- No --> Pending["/pending-approval"]
  Approved -- Sí --> Role{"¿rol ≥ minRole de la ruta?"}
  Role -- No --> Home["/home"]
  Role -- Sí --> Render["Renderiza la ruta (Outlet)"]
```

| Ruta | `minRole` | Componente |
|---|---|---|
| `/`, `/home` | `user` | `Home` |
| `/predicacion` | `user` | `PredicacionView` |
| `/grupo` | `admin` | `GroupSelector` |
| `/foliotable` | `admin` | `FolioTable` |
| `/grouprenamer` | `admin` | `GroupSelectorRenamer` |
| `/pdfvisualizer`, `/pdfpageinfoedit` | `admin` | `PDFVisualizer`, `PDFPageInfoEdit` |
| `/predicacioneditor` | `admin` | `PredicacionEditor` |
| `/casasnovisitar` | `admin` | `CasasNoVisitarAdmin` |
| `/adminpanel` | `manager` | `AdminPanel` |
| `/login` | pública | `LoginPage` |
| `/pending-approval` | autenticado (sin exigir aprobación) | `PendingApproval` |

`PendingApproval` se auto-redirige a `/home` si el perfil resulta aprobado mientras está montado —
protección contra que un falso negativo momentáneo (ver Flujos, cache de Firestore) deje a alguien
atascado ahí.

`useRememberRoute()` guarda la última ruta visitada en `sessionStorage`; si la app carga
directamente en `/`, restaura esa ruta en vez de mostrar siempre el dashboard — pensado para
cuando el sistema operativo recarga la pestaña/PWA en segundo plano.

## Flujos clave (diagramas de secuencia)

### 1. Login y aprobación de una cuenta nueva

```mermaid
sequenceDiagram
    participant U as Usuario
    participant LP as LoginPage
    participant AP as AuthProvider
    participant FA as Firebase Auth
    participant FS as Firestore (users)
    participant PR as PrivateRoutes

    U->>LP: Click "Login con Google"
    LP->>AP: loginWithGoogle()
    AP->>FA: signInWithPopup()
    FA-->>AP: usuario autenticado
    AP->>FS: getDoc(users/{uid})
    alt doc no existe
        AP->>FS: setDoc({role:'user', status:'pending', ...})
    end
    AP-->>LP: navega a /home
    LP->>PR: render
    PR->>AP: isApproved? (via onSnapshot en users/{uid})
    PR-->>U: redirige a /pending-approval

    Note over U,FS: Más tarde, un manager/superuser aprueba desde AdminPanel
    FS-->>AP: onSnapshot: status='approved'
    AP-->>PR: isApproved = true
    PR-->>U: /pending-approval se auto-redirige a /home
```

### 2. Marcar una manzana como completada

```mermaid
sequenceDiagram
    participant U as Usuario (admin+)
    participant GS as GroupSelector
    participant GC as grupoContext
    participant FS as Firestore (territories)
    participant TC as TerritorioDelDiaCard

    Note over TC: otro cliente, viendo el mismo grupo/día
    U->>GS: click en una manzana
    GS->>GC: toggleManzanaStatus(grupo, areaKey, index)
    GC->>GC: recalcula manzanas[], fechaInicio/fechaFin
    GC->>FS: updateDoc con dot-notation atómica
    FS-->>GS: onSnapshot propio: progreso actualizado
    FS-->>TC: onSnapshot de otro cliente: territorio "iniciado hoy"
```

### 3. Edición con debounce en el arreglo de predicación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant IN as input (Horario/Asignado)
    participant PE as PredicacionEditor (draft local)
    participant FS as Firestore

    U->>IN: escribe
    IN->>PE: onChange → actualiza draft + reinicia timer (600ms)
    U->>IN: sigue escribiendo
    IN->>PE: onChange → cancela timer anterior, reinicia
    Note over PE: 600ms sin nuevas teclas
    PE->>FS: setDoc (merge) con el valor final
    alt el usuario cambia de pestaña/app antes de los 600ms
        PE->>FS: flush inmediato (visibilitychange / blur)
    end
    FS-->>PE: onSnapshot confirma, se limpia el draft
```

### 4. Registrar una casa no visitar con foto

```mermaid
sequenceDiagram
    participant U as Admin
    participant CA as CasasNoVisitarAdmin
    participant IC as browser-image-compression
    participant ST as Cloud Storage
    participant FS as Firestore
    participant H as Home / GroupSelector / TerritorioDelDiaCard

    U->>CA: elige Grupo→Territorio→Manzana, foto, guarda
    CA->>IC: compress(file, {maxSizeMB:0.5, maxWidthOrHeight:1280})
    IC-->>CA: archivo comprimido
    CA->>ST: uploadBytes(casas_no_visitar/{id}.jpg)
    ST-->>CA: getDownloadURL()
    CA->>FS: setDoc (merge) con imagenUrl + datos del formulario
    FS-->>H: onSnapshot: aparece en la tabla del dashboard
    FS-->>H: onSnapshot: aparece el badge 🚫 en la manzana vinculada
```

## Quién lee qué colección

```mermaid
flowchart LR
  subgraph Componentes
    Home[Home.jsx]
    GS[GroupSelector.jsx]
    FT[FolioTable.jsx]
    PE[PredicacionEditor.jsx]
    PV[PredicacionView.jsx]
    CA[CasasNoVisitarAdmin.jsx]
    TC[TerritorioDelDiaCard.jsx]
    AP[AdminPanel.jsx]
  end
  subgraph Colecciones
    USERS[("users")]
    TERR[("territories")]
    FOLIO[("folio_records")]
    PRED[("arregloPredicacion")]
    LUG[("lugares_predicacion")]
    CASAS[("casas_no_visitar")]
  end

  GS --> TERR
  GS --> CASAS
  FT --> FOLIO
  FT --> TERR
  PE --> PRED
  PE --> LUG
  PV --> PRED
  PV --> LUG
  CA --> CASAS
  CA --> TERR
  TC --> TERR
  TC --> PRED
  TC --> LUG
  TC --> CASAS
  Home --> CASAS
  AP --> USERS
```

## Patrones establecidos (seguir para código nuevo)

- **Helpers pequeños duplicados por archivo** en vez de un util compartido: `formatDate`,
  `getSaturdays`, etc. aparecen casi idénticos en varios componentes a propósito — es la
  convención ya asentada en este repo, priorizando simplicidad sobre DRY para funciones triviales.
- **Lecturas independientes por componente**: componentes como `TerritorioDelDiaCard` o el badge de
  `GroupSelector` hacen su propio `onSnapshot`/`getDoc` en vez de pasar por `grupoContext`, porque
  necesitan datos de un grupo que puede no ser el `nombreGrupo` seleccionado en ese momento (el
  grupo del día no tiene por qué coincidir con el grupo que el usuario tiene abierto en pantalla).
  `grupoContext` sigue siendo la fuente para todo lo relacionado al grupo activo/seleccionado.
- **Modo de prueba para cuentas** (`AuthProvider.loginAsTestUser`): en `import.meta.env.DEV`,
  `/login` muestra botones para entrar como cada nivel de rol sin pasar por OAuth — escribe
  perfiles reales en Firestore (`test-user`, `test-admin`, etc.), útil para probar permisos sin
  crear cuentas de Google reales. Se elimina del bundle de producción (Vite descarta ese código al
  compilar con `import.meta.env.DEV = false`).
- **Debounce + flush en inputs de texto ligados a Firestore**: ver Flujo 3 — patrón a repetir si se
  agregan más campos de texto que escriban en cada tecla.
- **Modal de foto compartido** (`ImagePreviewModal.jsx`): cualquier lugar nuevo que muestre una foto
  debería reutilizar este componente en vez de abrir la imagen en una pestaña nueva.

## Limitaciones conocidas

- **Sin reglas de seguridad de Firestore/Storage** — el control de acceso descrito arriba es solo
  de UI/rutas; cualquier usuario autenticado podría, en teoría, llamar a Firestore directamente
  desde la consola del navegador y saltarse los chequeos de rol. Ver `AUDIT.md`.
- **Sin notificaciones push todavía** — diseño completo en
  [`docs/push-notifications-plan.md`](push-notifications-plan.md), pendiente de Cloud Functions +
  plan Blaze.
- **Sin suite de pruebas automatizadas** — toda verificación es manual (ver notas de verificación
  en cada plan/feature de este repo).
