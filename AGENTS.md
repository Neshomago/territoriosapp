# AGENTS.md — TerritoriosApp

Contexto para agentes de IA que trabajen en este repositorio. Léelo antes de modificar código.

## Documentación existente (leer según la tarea)

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — arquitectura, modelo de datos, rutas, roles y flujos. **Fuente principal de contexto.**
- [`AUDIT.md`](AUDIT.md) — bugs conocidos y mejoras pendientes del código heredado.
- [`REACT_REVIEW.md`](REACT_REVIEW.md) y [`error_learnings.md`](error_learnings.md) — lecciones de una fase anterior (stale closures, esquema de folio, offline).
- [`CHANGELOG.md`](CHANGELOG.md) — historial de una rama anterior.
- [`docs/push-notifications-plan.md`](docs/push-notifications-plan.md) — spec de notificaciones push, aún no implementada.

## Resumen

SPA para que una congregación gestione territorios de predicación: manzanas completadas, folio
histórico S-13-S, arreglo semanal/mensual de predicación, catálogo de lugares con enlace a Google
Maps y casas que no deben visitarse. Acceso por roles con flujo de aprobación de cuentas.

## Comandos

```bash
npm install
npm run dev      # Vite dev server
npm run build    # build a dist/
npm run lint     # eslint, --max-warnings 0
```

- No hay TypeScript ni suite de tests. Verificación = lint + build + prueba manual.
- Para un archivo puntual: `npx eslint src/components/Archivo.jsx`.

## Stack

- React 18 (JS/JSX, **sin TypeScript**), Vite 5, React Router v6.
- Tailwind CSS 3 + HeroUI (`@heroui/react`).
- Firebase: Auth (Google/Outlook), Firestore (caché offline `persistentLocalCache`), Storage.
- PDF: `pdf-lib` (generación) y `pdfjs-dist` (visualización).
- Imágenes: `browser-image-compression` antes de subir a Storage.
- Sin backend propio ni reglas de Firestore/Storage: el control de acceso es solo de cliente.

## Configuración y secretos

- Variables en `.env.local` (gitignored): `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
  `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`,
  `VITE_FIREBASE_APP_ID`. **Nunca commitear `.env*`.**
- `src/components/firebase.jsx` centraliza `db`, `auth`, `storage` y `COLLECTIONS`.
- `IS_TEST_MODE` en `firebase.jsx` se cambia **a mano** antes de desplegar. Actualmente `false`.
  `COLLECTIONS.USERS` siempre es `users`, sin importar el modo.

## Estructura

```text
src/
  App.jsx                    Rutas + guardas (PrivateRoutes con minRole)
  main.jsx                   Entrada (HeroUIProvider + StrictMode)
  components/
    AuthProvider.jsx         Sesión, perfil y rol (onSnapshot users/{uid})
    PrivateRoutes.jsx        Guarda auth → aprobación → rol
    contexts/grupoContext.jsx Territorios + folio del grupo activo
    TerritorioDelDiaCard.jsx Card "qué toca hoy" (lunes-viernes / sábados)
    GroupSelector.jsx        Ver/editar territorios y manzanas
    FolioTable.jsx           Editor del libro mayor S-13-S
    PDFVisualizer.jsx        Generación de PDF sobre plantilla S-13_S.pdf
    PredicacionEditor.jsx    Editor semanal/mensual + CRUD de lugares
    PredicacionView.jsx      Vista de solo lectura del arreglo
    CasasNoVisitarAdmin.jsx  CRUD de casas no visitar con foto
    AdminPanel.jsx           Aprobar cuentas y asignar roles
    ImagePreviewModal.jsx    Modal compartido para fotos
    utils/userAccess.js      Jerarquía de roles y permisos
docs/ARCHITECTURE.md         Documentación técnica completa
```

## Modelo de datos (resumen)

- `users`: `{ name, email, role, status, createdAt, ... }`. Perfiles legacy sin `role`/`status` se
  consideran aprobados.
- `territories/{grupo}`: `{ name, mapa: { imagen, area: { [key]: { name, fechaInicio, fechaFin,
  user, manzanas: [{ name, completed }] } } } }`.
- `folio_records`: un documento plano por asignación histórica.
- `arregloPredicacion`: docs `semanal_*` (`{ tipo:'semanal', dia, horario, lugarId, asignado }`) y
  `mensual_*_{orden}` (`{ tipo:'mensual', dia, orden, grupos, lugarId, asignado }`).
- `lugares_predicacion`: `{ nombre, mapsUrl }`.
- `casas_no_visitar`: `{ grupo, territorioKey, manzanaName, villa, ref, fecha, imagenUrl, ... }`.

Todos los nombres reales pasan por `COLLECTIONS`; nunca escribas el nombre de colección a mano.

## Roles y rutas

- Jerarquía: `user < admin < manager < superuser` (`utils/userAccess.js`).
- `user`: `/home`, `/predicacion` (solo lectura).
- `admin`: además `/grupo`, `/foliotable`, `/grouprenamer`, `/pdfvisualizer`,
  `/pdfpageinfoedit`, `/predicacioneditor`, `/casasnovisitar`.
- `manager`: además `/adminpanel`.
- `superuser`: puede gestionar roles `manager`/`superuser`.

## Convenciones de código (seguir las existentes)

- UI, comentarios y nombres de dominio en **español**; variables/componentes en el estilo ya usado.
- Componentes funcionales, `export default` en páginas y `export function` donde ya se hace así.
- **No introducir TypeScript** ni dependencias nuevas sin necesidad clara.
- Tailwind: usar los tokens del `tailwind.config.js` (`surface-*`, `on-surface*`, `primary`,
  `secondary`, `tertiary`, `shadow-ambient`, etc.) en vez de colores/medidas arbitrarias.
- Helpers pequeños (`formatDate`, etc.) se duplican por archivo **a propósito**; no crear un util
  compartido solo por DRY.
- Lecturas en tiempo real con `onSnapshot`; resolver documentos relacionados con `getDoc` por id.
- Escrituras atómicas en Firestore con `updateDoc` y **dot notation**. Evitar `setTimeout` sobre
  estado capturado (stale closure) — ya causó pérdida de datos.
- Inputs de texto que escriben a Firestore: debounce (~600 ms) + flush en
  `visibilitychange`/`pagehide`.
- Fotos: reutilizar `ImagePreviewModal` en vez de abrir la imagen en otra pestaña.
- No añadir comentarios nuevos salvo que aporten contexto no obvio.

## Gotchas del dominio

- `TerritorioDelDiaCard` decide por `getDay()`: lunes-viernes usa `GRUPO_POR_DIA` y el doc
  `territories/{grupo}`; sábado usa `arregloPredicacion` `tipo:'mensual'` filtrado por fecha ISO
  (`YYYY-MM-DD`); domingo no hay territorio.
- El lugar de predicación de un día vive en `arregloPredicacion` (`lugarId`) y se resuelve contra
  `lugares_predicacion` (`{ nombre, mapsUrl }`). No está dentro de `mapa.area`.
- El primer y último sábado del mes admiten 1 grupo; los intermedios hasta 2 `orden`.
- No hay `firestore.rules`: los roles solo se aplican en la UI/rutas.

## Antes de terminar una tarea

1. Ejecutar `npx eslint <archivos cambiados>` (o `npm run lint`).
2. Ejecutar `npm run build` si el cambio toca rutas, imports o configuración.
3. Probar manualmente el flujo afectado (login/rol, grupo, predicación, folio, PDF o casas).
4. No commitear ni desplegar salvo que se pida explícitamente.

## Estado del repo

- Rama de trabajo actual: `feat/dashboard-manzanas`.
- `firebase.json` despliega `dist/` a Firebase Hosting con rewrite a `index.html`.
