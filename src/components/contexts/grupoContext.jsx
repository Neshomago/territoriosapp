import { createContext, useContext, useState, useEffect } from "react";
import { 
  doc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  writeBatch, 
  serverTimestamp 
} from "firebase/firestore";
import { db, COLLECTIONS, IS_TEST_MODE } from "../firebase";
import { territorios } from "../utils/_utils";
import { useAuth } from '../AuthProvider';

const DatosGrupoContext = createContext();

export const DatosGrupoProvider = ({ children }) => {
    const [nombreGrupo, setNombreGrupo] = useState('Mejía');
    const [territorioActivo, setTerritorioActivo] = useState(null);
    const [folioRecords, setFolioRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    const { user } = useAuth();

    // 1. Escuchar estado de conexión de red
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setIsSyncing(true);
            setTimeout(() => setIsSyncing(false), 2500);
            console.log("🟢 Conexión a internet restaurada. Sincronizando con Firebase...");
        };
        const handleOffline = () => {
            setIsOnline(false);
            console.log("🟡 Modo sin conexión activado. Guardando localmente en IndexedDB.");
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Formateador de fecha estándar MM/DD/YYYY
    const formatDate = (date = new Date()) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    // Año teocrático ajustado (inicia en septiembre)
    const getAdjustedYear = () => {
        const now = new Date();
        const year = now.getFullYear();
        return String(now.getMonth() >= 8 ? year + 1 : year);
    };

    // 2. Suscripción en Tiempo Real al Estado Activo del Grupo (onSnapshot)
    useEffect(() => {
        if (!nombreGrupo) {
            setTerritorioActivo(null);
            return;
        }

        setLoading(true);
        const groupDocRef = doc(db, COLLECTIONS.TERRITORIES, nombreGrupo);

        const unsubscribeGroup = onSnapshot(groupDocRef, async (docSnap) => {
            if (docSnap.exists()) {
                setTerritorioActivo(docSnap.data());
                setLoading(false);
            } else {
                console.log(`ℹ️ No existe ${COLLECTIONS.TERRITORIES}/${nombreGrupo}. Inicializando con plantilla por defecto...`);
                // Si estamos en modo pruebas o no existe, inicializar desde static default
                const defaultData = territorios[nombreGrupo] || {
                    name: nombreGrupo,
                    mapa: {
                        imagen: `assets/territorio-${nombreGrupo.toLowerCase().replace(/[^a-z]/g, '')}.png`,
                        area: {}
                    }
                };
                try {
                    await setDoc(groupDocRef, defaultData);
                    setTerritorioActivo(defaultData);
                } catch (err) {
                    console.error("Error al inicializar datos del grupo:", err);
                    setTerritorioActivo(defaultData);
                } finally {
                    setLoading(false);
                }
            }
        }, (err) => {
            console.error("Error en onSnapshot de grupo:", err);
            setError("Error al sincronizar datos del grupo");
            setLoading(false);
        });

        return () => unsubscribeGroup();
    }, [nombreGrupo]);

    // 3. Suscripción en Tiempo Real a los Registros del Folio S-13-S (Historial Plano)
    useEffect(() => {
        if (!nombreGrupo) {
            setFolioRecords([]);
            return;
        }

        const folioColRef = collection(db, COLLECTIONS.FOLIO_RECORDS);
        const q = query(folioColRef, where("grupo", "==", nombreGrupo));

        const unsubscribeFolio = onSnapshot(q, async (querySnap) => {
            const records = [];
            querySnap.forEach((doc) => {
                records.push({ id: doc.id, ...doc.data() });
            });

            // Ordenar por número de territorio ascendente y fecha
            records.sort((a, b) => {
                if (a.territorioNumero !== b.territorioNumero) {
                    return a.territorioNumero - b.territorioNumero;
                }
                return (a.fechaInicio || '').localeCompare(b.fechaInicio || '');
            });

            setFolioRecords(records);
        }, (err) => {
            console.error("Error en onSnapshot de folio_records:", err);
        });

        return () => unsubscribeFolio();
    }, [nombreGrupo]);

    // 4. Operaciones Atómicas para Territorios en Vivo

    // Alternar estado de una manzana con actualización atómica
    const toggleManzanaStatus = async (groupName, areaKey, manzanaIndex, currentAssignee) => {
        if (!groupName || !territorioActivo) return;
        const area = territorioActivo?.mapa?.area?.[areaKey];
        if (!area) return;

        const updatedManzanas = area.manzanas.map((m, idx) => 
            idx === manzanaIndex ? { ...m, completed: !m.completed } : { ...m }
        );

        const completedCount = updatedManzanas.filter(m => m.completed).length;
        const progress = (completedCount * 100) / updatedManzanas.length;

        let newFechaInicio = area.fechaInicio || '';
        let newFechaFin = area.fechaFin || '';
        let newAssignee = area.user || currentAssignee || (user?.displayName ? `${user.displayName[0]}. ${user.displayName.split(' ')[1]}` : '');

        if (progress > 0 && !newFechaInicio) {
            newFechaInicio = formatDate(new Date());
        }

        if (progress === 100 && !newFechaFin) {
            newFechaFin = formatDate(new Date());
            if (!area.user && newAssignee) {
                // asignar usuario actual
            }
        } else if (progress < 100 && area.fechaFin) {
            newFechaFin = ''; // Si desmarca, vuelve a en progreso
        }

        try {
            const docRef = doc(db, COLLECTIONS.TERRITORIES, groupName);
            await updateDoc(docRef, {
                [`mapa.area.${areaKey}.manzanas`]: updatedManzanas,
                [`mapa.area.${areaKey}.fechaInicio`]: newFechaInicio,
                [`mapa.area.${areaKey}.fechaFin`]: newFechaFin,
                [`mapa.area.${areaKey}.user`]: newAssignee
            });
        } catch (err) {
            console.error("Error actualizando manzana en Firestore:", err);
            throw err;
        }
    };

    // Actualizar datos de un área (fechas y publicador asignado)
    const updateTerritoryDetails = async (groupName, areaKey, { fechaInicio, fechaFin, user: publisherName }) => {
        if (!groupName) return;
        try {
            const docRef = doc(db, COLLECTIONS.TERRITORIES, groupName);
            const updates = {};
            if (fechaInicio !== undefined) updates[`mapa.area.${areaKey}.fechaInicio`] = fechaInicio;
            if (fechaFin !== undefined) updates[`mapa.area.${areaKey}.fechaFin`] = fechaFin;
            if (publisherName !== undefined) updates[`mapa.area.${areaKey}.user`] = publisherName;

            await updateDoc(docRef, updates);
            console.log(`✅ Datos actualizados en Firestore para ${areaKey}`);
        } catch (err) {
            console.error("Error al actualizar datos del territorio:", err);
            throw err;
        }
    };

    // Reiniciar e archivar UN SOLO territorio individualmente
    const archiveAndRestartSingleTerritory = async (groupName, areaKey, customServiceYear) => {
        if (!groupName || !territorioActivo) return;
        const area = territorioActivo?.mapa?.area?.[areaKey];
        if (!area) return;

        const terrNum = parseInt(areaKey.replace('terr', '')) || 1;
        const serviceYear = customServiceYear || getAdjustedYear();
        const publisher = area.user || (user?.displayName ? `${user.displayName[0]}. ${user.displayName.split(' ')[1]}` : 'Sin asignar');
        const fechaInicio = area.fechaInicio || formatDate(new Date());
        const fechaFin = area.fechaFin || formatDate(new Date());

        try {
            // 1. Guardar registro en historial plano (folio_records)
            const folioColRef = collection(db, COLLECTIONS.FOLIO_RECORDS);
            const newRecordRef = doc(folioColRef);
            await setDoc(newRecordRef, {
                grupo: groupName,
                territorioNumero: terrNum,
                territorioName: area.name || `territorio ${terrNum}`,
                publicador: publisher,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                yearServicio: serviceYear,
                completado: true,
                createdAt: serverTimestamp()
            });

            // 2. Limpiar individualmente este territorio en el mapa activo
            const resetManzanas = Array.isArray(area.manzanas)
                ? area.manzanas.map(m => ({ ...m, completed: false }))
                : [];

            const groupDocRef = doc(db, COLLECTIONS.TERRITORIES, groupName);
            await updateDoc(groupDocRef, {
                [`mapa.area.${areaKey}.manzanas`]: resetManzanas,
                [`mapa.area.${areaKey}.fechaInicio`]: '',
                [`mapa.area.${areaKey}.fechaFin`]: '',
                [`mapa.area.${areaKey}.user`]: ''
            });

            console.log(`🎉 Territorio ${terrNum} archivado en folio_records y reiniciado correctamente.`);
        } catch (err) {
            console.error("Error al archivar y reiniciar territorio:", err);
            throw err;
        }
    };

    // 5. Métodos CRUD para FolioTable (Libro Mayor S-13-S)

    const saveFolioRecord = async (record) => {
        try {
            const folioColRef = collection(db, COLLECTIONS.FOLIO_RECORDS);
            if (record.id) {
                const recordDocRef = doc(db, COLLECTIONS.FOLIO_RECORDS, record.id);
                const { id, ...dataToSave } = record;
                await updateDoc(recordDocRef, {
                    ...dataToSave,
                    updatedAt: serverTimestamp()
                });
            } else {
                const newDocRef = doc(folioColRef);
                await setDoc(newDocRef, {
                    ...record,
                    grupo: record.grupo || nombreGrupo,
                    createdAt: serverTimestamp()
                });
            }
        } catch (err) {
            console.error("Error al guardar registro en folio_records:", err);
            throw err;
        }
    };

    const deleteFolioRecord = async (recordId) => {
        if (!recordId) return;
        try {
            const recordDocRef = doc(db, COLLECTIONS.FOLIO_RECORDS, recordId);
            await deleteDoc(recordDocRef);
        } catch (err) {
            console.error("Error al eliminar registro de folio_records:", err);
            throw err;
        }
    };

    const bulkUpdateFolioRecords = async (records) => {
        try {
            const batch = writeBatch(db);
            records.forEach(rec => {
                if (rec.id) {
                    const ref = doc(db, COLLECTIONS.FOLIO_RECORDS, rec.id);
                    const { id, ...cleanData } = rec;
                    batch.update(ref, { ...cleanData, updatedAt: serverTimestamp() });
                }
            });
            await batch.commit();
            console.log("✅ Actualización masiva de registros completada.");
        } catch (err) {
            console.error("Error en bulkUpdateFolioRecords:", err);
            throw err;
        }
    };

    // Compatibilidad con componentes legados
    const dataDeGrupo = territorioActivo;
    const getDataDeGrupo = async (nombre) => {
        setNombreGrupo(nombre);
    };

    return (
        <DatosGrupoContext.Provider value={{
            nombreGrupo,
            setNombreGrupo,
            territorioActivo,
            dataDeGrupo,
            folioRecords,
            getDataDeGrupo,
            toggleManzanaStatus,
            updateTerritoryDetails,
            archiveAndRestartSingleTerritory,
            saveFolioRecord,
            deleteFolioRecord,
            bulkUpdateFolioRecords,
            isOnline,
            isSyncing,
            loading,
            error,
            isTestMode: IS_TEST_MODE
        }}>
            {children}
        </DatosGrupoContext.Provider>
    );
};

export const useDatosGrupoContext = () => useContext(DatosGrupoContext);
export default DatosGrupoContext;