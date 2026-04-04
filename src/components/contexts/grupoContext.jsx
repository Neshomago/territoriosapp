import { createContext, useContext, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { RESTART_DATA_FOR_GROUP_S13_ECHEVERRIA, RESTART_DATA_FOR_GROUP_S13_JARA, RESTART_DATA_FOR_GROUP_S13_LEON, RESTART_DATA_FOR_GROUP_S13_MEJIA, RESTART_DATA_FOR_GROUP_S13_MOSQUERAD, RESTART_DATA_FOR_GROUP_S13_MOSQUERAN, RESTART_DATA_FOR_GROUP_S13_VILLAREAL } from "../utils/_utils";
import { db } from "../firebase";
import { useAuth } from '../AuthProvider';

const DatosGrupoContext = createContext();

const DatosGrupoProvider = ({ children }) => {
    const [ nombreGrupo, setNombreGrupo ] = useState('');
    const [ dataDeGrupo, setDataDeGrupo ] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const {user} = useAuth();

    const getDataDeGrupo = async (nombreDeGrupo) => {
        if (!nombreDeGrupo) return;

        setLoading(true);
        setError(null);

        try {
            const docRef = doc(db, 'folioAlboradaEste', nombreDeGrupo);
            const docSnap = await getDoc(docRef);
            
            if(!docSnap.exists()) {
                console.log('No existe este grupo');
                setDataDeGrupo(null);
                return null;
            } else {
                const data = docSnap.data();
                setDataDeGrupo(data);
                return data;
            };
        } catch (error) {
            setError("Error al obtener los datos del grupo");
            console.error("Error fetching group data:", err);
        } finally {
            setLoading(false);
        }
    }

    const saveRegistry = async(nombreDeGrupo, territorios) => {
        if (!nombreDeGrupo) return;
        setLoading(true);
        setError(null);

        const userObject = `${user.displayName[0]}. ${user.displayName.split(' ')[1]}`;
        try {
            // 1. Obtener los datos necesarios
            const docRef = doc(db, 'folioAlboradaEste', nombreDeGrupo);
            const docSnap = await getDoc(docRef);

            // Inicializar el folio si no existe
            let segundoObjeto = docSnap.exists() && docSnap.data() && Object.keys(docSnap.data()).length > 0 
            ? docSnap.data() 
            : {
                name: nombreDeGrupo,
                lastUpdatedDate: '',
                completed: false,
                pages: []
            };

            // Asegurar que las propiedades esenciales existan aunque el doc exista pero venga vacío o incompleto
            if (!segundoObjeto.pages) {
                segundoObjeto.pages = [];
                console.log("⚠️ 'pages' no existía, inicializado como []");
            }
            if (!segundoObjeto.name) {
                segundoObjeto.name = nombreDeGrupo;
            }
            if (typeof segundoObjeto.completed !== 'boolean') {
                segundoObjeto.completed = false;
            }
            if (!segundoObjeto.lastUpdatedDate) {
                segundoObjeto.lastUpdatedDate = '';
            }

            // 2. Implementar la lógica de actualización del segundo objeto
            const areas = Object.entries(territorios);
            console.log(segundoObjeto);
            for (const [areaKey, area] of areas) {
                const columnaNum = parseInt(areaKey.replace('terr', ''));

                // Determinar la página donde se debe guardar
                const paginaDestino = columnaNum <= 5 ? 1 : 2;
                const numeroDeTerritorios = Object.keys(territorios).length;
                console.log(territorios);
                console.log(numeroDeTerritorios);
                
                // Buscar o crear la página correspondiente
                let pagina = segundoObjeto.pages.find(p => p.page === paginaDestino);
                if (!pagina) {
                    pagina = {
                        page: paginaDestino,
                        columns: [],
                    };
                    segundoObjeto.pages.push(pagina);
                    console.log(`✅ Página ${paginaDestino} creada`);
                } else {
                    console.log(`📄 Página ${paginaDestino} encontrada`);
                }

                // Buscar o crear la columna correspondiente
                let columna = pagina.columns.find(c => c.name === columnaNum.toString());
                if (!columna) {
                    columna = {
                        name: columnaNum.toString(),
                        completed: false,
                        rows: []
                    };
                    pagina.columns.push(columna);
                    console.log(`✅ Columna ${columnaNum} creada en página ${paginaDestino}`);
                } else {
                    console.log(`📌 Columna ${columnaNum} encontrada en página ${paginaDestino}`);
                }

                // Validar y registrar fila
                let filaYaExiste = false;
                let filaConStart = null;
                let ultimaFila = columna.rows[columna.rows.length - 1];

                columna.rows.forEach(row => {
                    if (row.startDate === area.fechaInicio && row.endDate === area.fechaFin) {
                        filaYaExiste = true;
                    } else if (row.startDate === area.fechaInicio && !row.endDate) {
                        filaConStart = row;
                    }
                });
    
                if (filaYaExiste) {
                    console.log(`⛔ Entrada duplicada encontrada para columna ${columnaNum}`);
                    continue;
                }

                if (filaConStart) {
                    filaConStart.endDate = area.fechaFin;
                    filaConStart.name = area.user || '';
                    console.log(`📝 Fecha fin agregada en fila existente para columna ${columnaNum}`);
                } else {
                    if (columna.rows.length < 25) {
                        columna.rows.push({
                            startDate: area.fechaInicio,
                            endDate: area.fechaFin,
                            name: area.user || ''
                        });
                        console.log(`✅ Nueva fila añadida en columna ${columnaNum}`);
                    }
    
                    if (columna.rows.length === 25) {
                        columna.completed = true;
                        console.log(`🎉 Columna ${columnaNum} marcada como completa`);
                    }
                }
            }

            console.log(!docSnap.exists());
            console.log(segundoObjeto);
            if (!docSnap.exists()) {
                await setDoc(docRef, segundoObjeto, { merge: true });
                console.log("✅ Guardado exitosamente con merge");
            } else {
                await updateDoc(docRef, segundoObjeto);
                console.log("✅ Datos actualizados correctamente en Firebase");
            }
        } catch (err) {
            setError("Error al crear un nuevo registro");
            console.error("❌ Error creating new registry:", err);
        } finally {
            setLoading(false);
        }   
    }

    const createNewRegistry = async (nombreDeGrupo, territorios) => {
        if (!nombreDeGrupo) return;
        
        // Descomentar para guardar folios vacios
        /* console.log(nombreDeGrupo);
        let grupo = '';
        let elementoGrupo = {};
        switch (nombreDeGrupo) {
            case 'Mejía':
                elementoGrupo = RESTART_DATA_FOR_GROUP_S13_MEJIA
                break;
            case 'Echeverría':
                elementoGrupo = RESTART_DATA_FOR_GROUP_S13_ECHEVERRIA
                break;
            case 'Mosquera(noche)':
                elementoGrupo = RESTART_DATA_FOR_GROUP_S13_MOSQUERAN
                break;
            case 'Mosquera(mañana)':
                elementoGrupo = RESTART_DATA_FOR_GROUP_S13_MOSQUERAD
                break;
            case 'Jara':
                elementoGrupo = RESTART_DATA_FOR_GROUP_S13_JARA
                break;
            case 'Villareal':
                elementoGrupo = RESTART_DATA_FOR_GROUP_S13_VILLAREAL
                break;
            case 'León':
                elementoGrupo = RESTART_DATA_FOR_GROUP_S13_LEON
                break;
            default:
                break;
        }
        console.log(elementoGrupo);     
        await updateDoc(doc(db, 'folioAlboradaEste', nombreDeGrupo), elementoGrupo); */

        setLoading(true);
        setError(null);

        const userObject = `${user.displayName[0]}. ${user.displayName.split(' ')[1]}`
        
        try {
            // 1. Obtener los datos necesarios
            const segundoObjeto = await getDoc(doc(db, 'folioAlboradaEste', nombreDeGrupo)).then(docSnap => docSnap.data());

            // 2. Implementar la lógica de actualización del segundo objeto
            const areas = Object.entries(territorios);
            areas.forEach(([areaKey, area]) => {
                const columnaCorrespondiente = parseInt(areaKey.replace('terr', ''));
                let columnaEncontrada = null;
                let paginaEncontrada = null;
                
                segundoObjeto.pages.forEach(folio => {
                    const columna = folio.columns.find(col => parseInt(col.name) === columnaCorrespondiente);
                    if (columna) {
                        columnaEncontrada = columna;
                        paginaEncontrada = folio.page;
                    }
                });

                if (columnaEncontrada && !columnaEncontrada.completed) {
                    let rowDisponible = columnaEncontrada.rows;
                    
                    if (!rowDisponible || rowDisponible.length < 25) {
                        rowDisponible.push({
                            startDate: area.fechaInicio,
                            endDate: area.fechaFin,
                            name : userObject
                        })
                    }
                    
                    if (rowDisponible.length === 25) {
                        columnaEncontrada.completed = true;
                    }
                } else {
                    const nuevaPagina = {
                        page: segundoObjeto.pages.length + 1,
                        columns: [
                            {
                                name: columnaCorrespondiente.toString(),
                                completed: false,
                                rows: [{
                                    startDate: area.fechaInicio,
                                    endDate: area.fechaFin,
                                    name: userObject
                                }]
                            }
                        ]
                    };
                    segundoObjeto.pages.push(nuevaPagina);
                }
            });

            // 3. Actualizar el segundo objeto en Firebase - DESCOMENTAR PARA GUARDAR EN FIREBASE
            await updateDoc(doc(db, 'folioAlboradaEste', nombreDeGrupo), segundoObjeto);

            // OPCIONAL SI SE DESEA RESETEAR EL PRIMERO OBJETO - NO ES NECESARIA ESTA LOGICA
            // 4. Resetear el primer objeto
            //setDataDeGrupo(RESTART_DATA_FOR_GROUP_S13);
            // 5. Actualizar el primer objeto en Firebase
            //await updateDoc(doc(db, 'folioAlboradaEste', nombreDeGrupo), RESTART_DATA_FOR_GROUP_S13);
        } catch (err) {
            setError("Error al crear un nuevo registro");
            console.error("Error creating new registry:", err);
        } finally {
            setLoading(false);
        }   
    }

    return (
        <DatosGrupoContext.Provider value={{
            nombreGrupo,
            setNombreGrupo,
            dataDeGrupo,
            getDataDeGrupo,
            createNewRegistry,
            saveRegistry,
            loading,
            error
        }}>
            {children}
        </DatosGrupoContext.Provider>
    )
};

const useDatosGrupoContext = () => useContext(DatosGrupoContext);

export { DatosGrupoProvider, useDatosGrupoContext};
export default DatosGrupoContext;