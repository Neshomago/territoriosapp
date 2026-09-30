# Aprendizajes y Lecciones Técnicas — TerritoriosApp

Este documento recopila las causas de errores identificados durante la auditoría del proyecto, las soluciones aplicadas y las pautas para evitar regresiones en el futuro.

---

## 1. Riesgo de Pérdida de Datos por *Stale Closures* en React + Firebase

### Causa del Problema:
En [`GroupSelector.jsx`](file:///c:/Users/torre/Documents/development/territoriosapp/src/components/GroupSelector.jsx), al hacer clic en una casilla de manzana se ejecutaba:
```javascript
setSelectedTerritory((prev) => {
  // mutaciones locales...
  return updatedTerritory;
});

setTimeout(async () => {
  await actualizarFirebase(selectedTerritory); // ❌ 'selectedTerritory' provenía del closure anterior (stale state)
}, 20);
```
En dispositivos lentos o con múltiples clics consecutivos, la llamada asíncrona enviaba a Firestore el estado anterior, revirtiendo silenciosamente los cambios hechos por el usuario o por otros publicadores.

### Solución Aplicada:
1. Eliminar `setTimeout` y suscripciones manuales desacopladas.
2. Usar **actualizaciones atómicas en Firestore (*dot notation*)**:
   ```javascript
   await updateDoc(docRef, {
     [`mapa.area.${areaKey}.manzanas`]: updatedManzanas,
     [`mapa.area.${areaKey}.fechaInicio`]: newFechaInicio,
     [`mapa.area.${areaKey}.fechaFin`]: newFechaFin
   });
   ```
3. Suscribir la interfaz a Firestore con `onSnapshot` en [`grupoContext.jsx`](file:///c:/Users/torre/Documents/development/territoriosapp/src/components/contexts/grupoContext.jsx) para que React reciba la verdad autoritativa de la base de datos en tiempo real.

---

## 2. Acoplamiento entre Formato Físico de PDF y Base de Datos

### Causa del Problema:
La estructura anterior guardaba en Firebase un objeto estructurado como `pages[].columns[].rows[]` con límites fijos (máximo 25 filas por columna, columnas 1 a 5 en página 1, 6 a 10 en página 2).
Esto provocaba:
- Imposibilidad de consultar, ordenar o filtrar fácilmente las asignaciones por año de servicio o por publicador.
- Riesgo de romper el esquema de datos si la cantidad de territorios o asignaciones cambiaba.

### Solución Aplicada (Opción C — Libro Mayor Plano):
- Almacenar cada asignación como un documento independiente en la colección `folio_records`:
  ```typescript
  {
    grupo: "Mejía",
    territorioNumero: 1,
    publicador: "D. Cabrera",
    fechaInicio: "05/24/2025",
    fechaFin: "07/24/2025",
    yearServicio: "2025",
    completado: true
  }
  ```
- El componente [`FolioTable.jsx`](file:///c:/Users/torre/Documents/development/territoriosapp/src/components/FolioTable.jsx) agrupa y presenta estos registros en filas limpias.
- El componente [`PDFVisualizer.jsx`](file:///c:/Users/torre/Documents/development/territoriosapp/src/components/PDFVisualizer.jsx) toma estos registros y dibuja dinámicamente las coordenadas en el formulario S-13-S, independizando completamente la base de datos del layout del PDF.

---

## 3. Persistencia Offline en Entornos Móviles

### Pauta Aplicada:
El SDK de Firestore v10 ofrece persistencia local multinavegador mediante `persistentLocalCache` y `persistentMultipleTabManager`.
- Al inicializar Firestore con esta configuración, las consultas y escrituras se ejecutan contra IndexedDB instantáneamente sin bloquear la interfaz.
- La cola de mutaciones pendientes se despacha a la nube de manera transparente y atómica tan pronto el navegador recupera conectividad.

---

## 4. Aislamiento de Entorno de Pruebas

### Pauta Aplicada:
Para permitir probar y validar el flujo en local sin comprometer la base de datos de producción:
- Centralizar los nombres de las colecciones en [`firebase.jsx`](file:///c:/Users/torre/Documents/development/territoriosapp/src/components/firebase.jsx) bajo el mapa `COLLECTIONS`.
- Configurar el flag `IS_TEST_MODE = true` que conmuta a `territories_test` y `folio_records_test`.
- Mostrar un distintivo visual (*🧪 Modo Pruebas*) en el navbar para asegurar visibilidad al desarrollador.
