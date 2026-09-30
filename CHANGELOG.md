# CHANGELOG — TerritoriosApp

Todos los cambios notables realizados en la rama `feature/new-implementation-plan` para la optimización de datos en Firebase Firestore, soporte offline, editor de tablas S-13-S y sincronización en tiempo real.

---

## [Unreleased] - 2026-08-15

### 🚀 Nuevas Funcionalidades
- **Persistencia Offline y Sincronización Automática:**
  - Habilitada la caché local multinavegador de Firestore (`persistentLocalCache` con `persistentMultipleTabManager`).
  - La aplicación ahora funciona sin conexión a internet (modo offline en el territorio), guardando todas las lecturas y escrituras localmente en IndexedDB.
  - Al recuperar la conexión a internet, los cambios se sincronizan automáticamente con la nube en segundo plano.
- **Sincronización en Tiempo Real (`onSnapshot`):**
  - Reemplazadas las llamadas puntuales `getDoc` por suscripciones reactivas en tiempo real.
  - Cuando un publicador marca una manzana o actualiza una fecha, el cambio se refleja de inmediato en los dispositivos de los demás hermanos conectados.
- **Campo de Publicador Editable (Punto 0.1):**
  - Añadido campo interactivo para asignar y editar el nombre del publicador responsable de cada territorio en `GroupSelector.jsx` y `FolioTable.jsx`.
- **Reinicio Individual por Territorio:**
  - Implementado botón *"📥 Archivar y Reiniciar"* por cada territorio individual cuando alcanza el 100% de completado o fecha de fin.
  - Archiva la vuelta completada en el libro mayor (`folio_records_test` / `folio_records`) y reinicia únicamente las casillas de ese territorio, sin alterar el resto del grupo.
- **Editor de Folio S-13-S (`FolioTable.jsx`):**
  - Creado nuevo componente y vista interactiva (`/foliotable`) con la estructura oficial del formulario S-13-S (hasta 4 asignaciones por fila para cada territorio).
  - Permite revisar, auditar, editar nombres de publicadores, corregir fechas erróneas de inicio y fin, añadir asignaciones manuales y eliminar registros equivocados antes de exportar el PDF.
- **Generación Directa de PDF S-13-S (`PDFVisualizer.jsx`):**
  - Conectado directamente a los registros limpios de `folio_records` generados y validados en el editor de tablas.
  - Soporta paginación automática (20 territorios por página) y dibujado fiel sobre la plantilla física `S-13_S.pdf`.
- **Aislamiento para Modo Pruebas (Testing Seguro):**
  - Configurado flag `IS_TEST_MODE = true` en `firebase.jsx` utilizando colecciones aisladas (`territories_test` y `folio_records_test`).
  - Permite probar localmente todas las funciones sin alterar los registros reales de producción.
- **Indicadores de Estado en la Barra de Navegación (`NavbarApp.jsx`):**
  - Distintivo de conectividad: 🟢 *En línea*, 🟡 *Sin conexión (Offline)*, 🔄 *Sincronizando...*
  - Distintivo de 🧪 *Modo Pruebas*.

---

### 🛠️ Correcciones y Mejoras de Rendimiento
- **Eliminación de condición de carrera con `setTimeout`:**
  - Corregido el bug en `GroupSelector.jsx` donde `setTimeout` leía el estado desactualizado de la clausura de React (*stale closure*), sobrescribiendo documentos completos en Firebase.
  - Ahora las actualizaciones de casillas y fechas usan rutas atómicas en Firestore (`updateDoc` con *dot notation*).
- **Corrección de Imports y Errores en Runtime:**
  - Añadido import de `updateDoc` en `AuthProvider.jsx` y eliminado llamado a `setTerritories` inexistente.
  - Añadido import de `deleteDoc` en `GroupSelectorRenamer.jsx`.
  - Corregido warning de `key` en listas de `React.Fragment` en `GroupSelector.jsx`.
- **Barra de Navegación Inferior (`FooterNavbar.jsx`):**
  - Añadidos botones directos de navegación fluida entre Inicio (`/home`), Territorios (`/grupo`), Folio S-13-S (`/foliotable`) y Formulario PDF (`/pdfvisualizer`).
