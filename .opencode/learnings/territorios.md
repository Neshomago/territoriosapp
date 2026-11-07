# Lecciones del agente — TerritoriosApp

Este archivo es la memoria de errores del agente. **Leerlo al inicio de cada tarea** y registrar
aquí cada fallo para no repetirlo. Formato:

```md
- **YYYY-MM-DD — síntoma**: qué falló.
  - Causa raíz: ...
  - Prevención: regla concreta para no repetirlo.
  - Archivos: `ruta:línea`.
```

Reglas generales:

- No cerrar una tarea sin `npx eslint <archivos>` (y `npm run build` si toca rutas/imports/config).
- Ante un fallo: diagnosticar causa raíz, corregir, re-verificar hasta verde y registrar la lección.
- Evitar duplicados: si la lección ya existe, actualizarla.
- Si la lección es una convención/gotcha del repo, reflejarla también en `AGENTS.md`.

## Lecciones registradas

- **2026-11-06 — El botón de Google Maps no aparecía en `TerritorioDelDiaCard`**:
  - Causa raíz: el lugar del día no vive en `territories/{grupo}.mapa.area`; vive en
    `arregloPredicacion` (`tipo:'semanal'`, `dia:'Lunes'…`) como `lugarId`, que apunta a
    `lugares_predicacion` (`{ nombre, mapsUrl }`). Se estaba buscando en el lugar equivocado.
  - Prevención: antes de conectar UI a datos, rastrear la fuente real de verdad (colección, campo y
    relación) con `grep`/`read`; no asumir que un campo relacionado existe en el documento visible.
  - Archivos: `src/components/TerritorioDelDiaCard.jsx`, `src/components/PredicacionEditor.jsx`.

- **2026-11-06 — Referencias de línea obsoletas tras editar**:
  - Causa raíz: los números de línea cambian después de cada inserción/eliminación y se citaron
    líneas que ya no correspondían.
  - Prevención: después de editar, releer el archivo o usar `git diff` antes de citar `ruta:línea`.
  - Archivos: `src/components/TerritorioDelDiaCard.jsx`.

- **2026-11-06 — "No veo el cambio" en una tarjeta condicionada por día/estado**:
  - Causa raíz: el render depende de `dayOfWeek`, `loading`, `lugarHoy`/`lugar` y de que exista un
    `mapsUrl`; si la rama o el estado no se cumple, el elemento no se monta aunque el código esté.
  - Prevención: al depurar UI "invisible", verificar primero la rama de render y que el estado se
    esté poblando (effects, `onSnapshot`, `null`), no solo el JSX.
  - Archivos: `src/components/TerritorioDelDiaCard.jsx`.

- **2026-11-06 — Modo prueba y despliegue**:
  - Causa raíz: `IS_TEST_MODE` en `src/components/firebase.jsx` se cambia a mano y es fácil
    olvidarlo antes de `firebase deploy`.
  - Prevención: revisar `IS_TEST_MODE` explícitamente en cualquier tarea que mencione despliegue o
    datos de producción. `COLLECTIONS.USERS` siempre es `users`.
  - Archivos: `src/components/firebase.jsx`, `firebase.json`.
