import { Button, Card, CardBody, Progress, Checkbox, useDisclosure, CardHeader, Divider } from '@heroui/react'
import { Modal, ModalContent, ModalBody, Image, Spinner } from '@heroui/react'
import { Select, SelectItem } from "@heroui/react";
import { DatePicker } from "@heroui/date-picker";
import { territorios } from './utils/_utils';
import { parseDate } from "@internationalized/date";

import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; // Importa la configuración de Firebase
import NavbarApp from './NavbarApp';
import FooterNavbar from './FooterNavbar';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useDatosGrupoContext } from './contexts/grupoContext';
import { div } from 'framer-motion/client';

export const GroupSelector = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [territoriosState, setTerritorios] = useState(territorios);
  const [grupo, setGrupo] = useState(null);
  const { setNombreGrupo, createNewRegistry, getDataDeGrupo, saveRegistry } = useDatosGrupoContext();
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [mapaTerritorio, setMapaTerritorio] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editButtonActive, setEditButtonActive] = useState({});
  const [fechaEditadas, setFechasEditadas] = useState({});
  const [loadingAreas, setLoadingAreas] = useState({});

  const navigateTo = useNavigate();
  const userObject = `${user.displayName[0]}. ${user.displayName.split(' ')[1]}`

  useEffect(() => {
    if (grupo) fetchSelectedTerritory(grupo);
  }, [grupo, mapaTerritorio]);

  const fetchSelectedTerritory = async (territorio) => {
    const docRef = doc(db, 'territories', territorio);
    const docSnap = await getDoc(docRef);

    //const docSnap = mockGetDoc(docRef);

    if (docSnap.exists()) {
      setSelectedTerritory(docSnap.data());
    } else {
      console.log("No se encontró el territorio en Firebase");
    }
  };

  //Metodo mock para data de prueba
  /* const mockGetDoc = (territorio) => {
      console.log('mockGetDoc: ' ,territorio);
      
      return {
      exists: () => true,
      data: () => territorios,
      };
  }; */

  const handleSetGrupo = (value) => {
    setLoading(true);
    setNombreGrupo(value);
    setGrupo(value);
  };

  const handleOpen = (terr) => {
    setMapaTerritorio(terr);
    console.log('al abrir', mapaTerritorio);

    onOpen();
  };

  const handleClose = () => {
    setMapaTerritorio("");
    console.log('al cerrar: ', mapaTerritorio);

    onClose();
  };

  const handleCheckboxChange = (areaKey, index) => {

    setSelectedTerritory((prev) => {
      console.log('lastTerritory', prev);
      const updatedTerritory = { ...prev };
      const area = updatedTerritory.mapa.area[areaKey];
      const manzana = area.manzanas[index];

      // Toggle the checkbox state
      manzana.completed = !manzana.completed;

      // Recalculate progress
      const progress = calculateProgress(area.manzanas);

      //Update 'fechaInicio' if progress is 0% and has first click
      if (progress > 0 && progress < 100 && !area.fechaInicio) {
        area.fechaInicio = cerrarFecha();
      }

      // Update `fechaFin` if progress reaches 100%
      if (progress === 100 && !area.fechaFin) {
        area.fechaFin = cerrarFecha();
        area.user = userObject;
      } else if (progress < 100) {
        area.fechaFin = ''; // Optional: Reset fechaFin if unchecking
      }

      return updatedTerritory;
    });

    //leer el folio y agregar las nuevas 2 paginas.

    setTimeout(async () => {
      try {
        await actualizarFirebase(selectedTerritory);
      } catch (error) {
        console.log('Error al actualizar Firebas: ', error);
      }
    }, 20);
  };

  const actualizarFirebase = async (territorioKey) => {
    try {
      const docRef = doc(db, 'territories', territorioKey.name);
      const updatedData = selectedTerritory;
      await updateDoc(docRef, updatedData);
      console.log("Datos actualizados en Firebase.", updatedData);
    } catch (error) {
      console.error("Error al actualizar en Firebase: ", error);
    }
  };

  function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes (0-11) + 1, ajustado a 2 dígitos
    const day = String(date.getDate()).padStart(2, '0');        // Día ajustado a 2 dígitos
    const year = date.getFullYear();                            // Año con 4 dígitos

    return `${month}/${day}/${year}`; // Devuelve la fecha en formato MM/DD/YYYY
  }

  const cerrarFecha = () => formatDate(new Date());

  const calculateProgress = (manzanas) => {
    const completedCount = manzanas.filter((m) => m.completed).length;
    return (completedCount * 100) / manzanas.length;
  };

  const handleSavePDF = async (nombreGrupo) => {
    const previousSelectedTerritory = JSON.parse(JSON.stringify(selectedTerritory));
    await saveRegistry(previousSelectedTerritory.name, previousSelectedTerritory.mapa.area)
    navigateTo('/pdfvisualizer');
  }

  const blankTerritories = () => {
    setSelectedTerritory((prev) => {
      const updatedNewTerritory = { ...prev };
      Object.values(updatedNewTerritory.mapa.area).forEach(
        (territory) => {
          territory.fechaInicio = '';
          territory.fechaFin = '';
          territory.user = '';

          if (Array.isArray(territory.manzanas)) {
            territory.manzanas.forEach((manzana) => {
              manzana.completed = false;
            })
          }
        })

      return updatedNewTerritory;
    })
  }

  const handlerRestartTerritories = async (nombreGrupo) => {
    const previousSelectedTerritory = JSON.parse(JSON.stringify(selectedTerritory));
    await createNewRegistry(previousSelectedTerritory.name, previousSelectedTerritory.mapa.area)
    blankTerritories();
    setTimeout(async () => {
      console.log('update to Firebase...');
      try {
        await actualizarFirebase(selectedTerritory);
      } catch (error) {
        console.log('Error al actualizar Firebas: ', error);
      }
    }, 20);
  }

  const handlerEditButton = (areaKey) => {
    setEditButtonActive(prevState => ({
      ...prevState,
      [areaKey]: !prevState[areaKey]
    }
    ));
  }

  const formatearFecha = (dateValue) => {
    if (!dateValue) return '';

    const mes = dateValue.month.toString().padStart(2, '0');
    const dia = dateValue.day.toString().padStart(2, '0');
    const año = dateValue.year;

    return `${mes}/${dia}/${año}`;
  };

  const receivedDateHyphenFormat = (dateValue) => {
    if (!dateValue) return null;
    const partesFecha = dateValue.split('/');
    return `${partesFecha[2]}-${partesFecha[0]}-${partesFecha[1]}`;
  }

  const handlerGuardarFecha = async (areaKey) => {
    const areaFechaReceived = selectedTerritory.mapa.area[areaKey];
    const fechasArea = fechaEditadas[areaKey] || {};
    const fechasFinales = {
      fechaInicio: fechasArea.fechaInicio || areaFechaReceived.fechaInicio,
      fechaFin: fechasArea.fechaFin || areaFechaReceived.fechaFin
    }

    if (!fechasFinales?.fechaInicio) {
      alert('Debe haber fecha inicio o no hay nada para guardar...')
      return ''
    }

    setLoadingAreas(prev => ({ ...prev, [areaKey]: true }));

    try {
      // Actualizar solo los campos específicos del área
      const docRef = doc(db, 'territories', selectedTerritory.name);
      const updateData = {
        [`mapa.area.${areaKey}.fechaInicio`]: fechasFinales.fechaInicio
      };

      if (fechasFinales.fechaFin) {
        updateData[`mapa.area.${areaKey}.fechaFin`] = fechasFinales.fechaFin;
      }

      handlerEditButton(areaKey);
      await updateDoc(docRef, updateData);

      // Actualizar también el estado local
      await fetchSelectedTerritory(grupo);

      console.warn(`Fechas guardadas correctamente para ${selectedTerritory.mapa.area[areaKey].name}`);
      console.log(`Fechas actualizadas en Firebase para ${areaKey}:`, {
        fechaInicio: fechasFinales.fechaInicio,
        fechaFin: fechasFinales.fechaFin
      });
    } catch (error) {
      console.error("Error al actualizar fechas en Firebase: ", error);
      alert("Error al guardar las fechas. Intenta nuevamente.");
    } finally {
      setLoadingAreas(prev => ({ ...prev, [areaKey]: false }));
    }
  }

  const actualizarFecha = (areaKey, tipo, fecha) => {
    setFechasEditadas(prev => ({
      ...prev,
      [areaKey]: {
        ...prev[areaKey],
        [tipo]: fecha
      }
    }));
  }


  return (
    <>
      <NavbarApp />
      <div className='p-4'>
        <Card>
          <CardBody>
            Seleccione el grupo:
            <div className='flex w-full gap-2 items-center'>
              <Select variant='bordered' label="Territorio" onChange={(e) => handleSetGrupo(e.target.value)}>
                {Object.keys(territoriosState).map(
                  (territorio) => <SelectItem key={territorio} value={territorio}>{territorio}</SelectItem>
                )}
              </Select>
            </div>
          </CardBody>
        </Card>
        {loading && !selectedTerritory && (<Spinner color='secondary' label='Cargando información...' size='lg' />)}
        {selectedTerritory && selectedTerritory.mapa && (
          <Card className='mt-4'>
            <CardHeader className='text-xl'>
              <div className='flex justify-stretch'>
                Territorios del Grupo {selectedTerritory.name}
              </div>
            </CardHeader>
            <div className='flex justify-around'>

              {/* <div className=''>
                    <Button className='w-50 ml-4'
                      color="success"
                      onPress={(e) => handleStartTerritories({selectedTerritory})}>
                      Guardar y Reiniciar
                    </Button>
                  </div> */}
              <div className=''>
                <Button className='w-50 ml-4'
                  onPress={() => handleOpen(selectedTerritory.mapa.imagen)}>
                  Ver tarjeta de territorio
                </Button>
              </div>
            </div>
            <CardBody id='territories'>
              {Object.entries(selectedTerritory.mapa.area)
                .sort(([, areaA], [, areaB]) => {
                  return areaA.name.localeCompare(areaB.name);
                })
                .map(([areaKey, area]) => (
                  <>
                    <Divider className='my-2' />
                    {loadingAreas[areaKey] && (
                      <div className='flex justify-center items-center py-4'>
                        <Spinner color='secondary' label='Guardando información...' size='lg' />
                      </div>
                    )
                    }
                    <div className='flex justify-between'>
                      <h1 className='text-lg font-semibold' key={areaKey}>
                        {area.name} {area.fechaFin ? <span>✅</span> : null}
                      </h1>
                      {area.fechaInicio &&
                        (<Button onPress={() => {
                          handlerEditButton(areaKey)
                        }}>{editButtonActive[areaKey] ? '❌ Cancelar Editar' : '📝 Editar'}</Button>
                        )}
                    </div>

                    {editButtonActive[areaKey] &&
                      (<div className='flex flex-col rounded-small m-2 p-2 bg-purple-50 '>
                        <div className='flex-1'>
                          <DatePicker key={`fecha-inicio-${areaKey}`}
                            label={"Fecha de inicio: "}
                            labelPlacement='outside-left'
                            defaultValue={parseDate(receivedDateHyphenFormat(area.fechaInicio))}
                            onChange={(e) => {
                              const fechaFormateada = formatearFecha(e);
                              actualizarFecha(areaKey, 'fechaInicio', fechaFormateada);
                            }} />
                        </div>

                        <div className='flex-1'>
                          <DatePicker key={`fecha-fin-${areaKey}`}
                            label={"Fecha de finalizado: "}
                            labelPlacement='outside-left'
                            defaultValue={area.fechaFin ? parseDate(receivedDateHyphenFormat(area.fechaFin)) : ''}
                            onChange={(e) => {
                              const fechaFormateada = formatearFecha(e);
                              actualizarFecha(areaKey, 'fechaFin', fechaFormateada);
                            }} />
                        </div>
                        <div className='flex-1'>
                          <Button size='sm' onPress={() => handlerGuardarFecha(areaKey)}>✅ Guardar Fecha</Button>
                        </div>
                      </div>)}

                    {!editButtonActive[areaKey] &&
                      (<h3 className='text-sm'>
                        Iniciado: {area.fechaInicio || "Por iniciar"} • Finalizado: {area.fechaFin || "En progreso"}
                      </h3>)}

                    <div className={area.fechaFin && !editButtonActive[areaKey] ? 'hidden' : ''}>
                      <Progress
                        className='mt-3'
                        label='Progreso de completado'
                        value={calculateProgress(area.manzanas)}
                        showValueLabel
                      />
                      <div className='grid grid-cols-5 gap-2'>
                        {area.manzanas.map((item, index) => (
                          <Checkbox
                            key={index}
                            isSelected={item.completed}
                            onChange={(e) => {
                              e.preventDefault();
                              handleCheckboxChange(areaKey, index);
                            }}
                          >
                            {item.name}
                          </Checkbox>
                        ))}
                      </div>
                    </div>
                  </>
                ))}

            </CardBody>
          </Card>
        )}

        {selectedTerritory &&
          (
            <div className='pb-5'>
              <div className='mb-10'>
                <Button className='mt-4 w-50 mr-2'
                  color="success"
                  onPress={(e) => handleSavePDF(selectedTerritory)}
                >
                  Guardar PDF 📄
                </Button>

                <Button className='mt-4 w-50 ml-2'
                  color="default"
                  onPress={(e) => handlerRestartTerritories()}
                >
                  Reiniciar Territorios
                </Button>
              </div>
            </div>
          )}
      </div>

      <Modal placement="center" backdrop='blur' isOpen={isOpen} onClose={handleClose}>
        <ModalContent>
          <ModalBody>
            Imagen de Territorio
            {/* <Image src="https://territorioscongre-ce8ad.web.app/assets/{mapaTerritorio}" /> */}
            <Image src={`assets/${mapaTerritorio}`} alt='Territorio' />
          </ModalBody>
        </ModalContent>
      </Modal>

      <FooterNavbar />
    </>
  );
}

