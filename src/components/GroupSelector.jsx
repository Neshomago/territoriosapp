import { Button, Card, CardBody, Progress, Checkbox, useDisclosure, CardHeader, Divider, Input, Chip } from '@heroui/react';
import { Modal, ModalContent, ModalBody, Image, Spinner } from '@heroui/react';
import { Select, SelectItem } from "@heroui/react";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import React, { useState } from 'react';
import NavbarApp from './NavbarApp';
import FooterNavbar from './FooterNavbar';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useDatosGrupoContext } from './contexts/grupoContext';
import { territorios } from './utils/_utils';

export const GroupSelector = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    nombreGrupo, 
    setNombreGrupo, 
    territorioActivo, 
    toggleManzanaStatus, 
    updateTerritoryDetails, 
    archiveAndRestartSingleTerritory,
    loading 
  } = useDatosGrupoContext();
  
  const [mapaTerritorio, setMapaTerritorio] = useState("");
  const { user } = useAuth();
  const [editButtonActive, setEditButtonActive] = useState({});
  const [editedTerritoryData, setEditedTerritoryData] = useState({});
  const [loadingAreas, setLoadingAreas] = useState({});

  const navigateTo = useNavigate();
  const defaultUserName = user?.displayName ? `${user.displayName[0]}. ${user.displayName.split(' ')[1]}` : '';

  const handleSetGrupo = (value) => {
    setNombreGrupo(value);
  };

  const handleOpen = (terr) => {
    setMapaTerritorio(terr);
    onOpen();
  };

  const handleClose = () => {
    setMapaTerritorio("");
    onClose();
  };

  const handleCheckboxChange = async (areaKey, index) => {
    try {
      setLoadingAreas(prev => ({ ...prev, [areaKey]: true }));
      await toggleManzanaStatus(nombreGrupo, areaKey, index, defaultUserName);
    } catch (error) {
      console.error('Error al actualizar manzana en Firestore: ', error);
      alert('Error al guardar el estado. Revisa tu conexión.');
    } finally {
      setLoadingAreas(prev => ({ ...prev, [areaKey]: false }));
    }
  };

  const calculateProgress = (manzanas) => {
    if (!manzanas || !Array.isArray(manzanas) || manzanas.length === 0) return 0;
    const completedCount = manzanas.filter((m) => m.completed).length;
    return Math.round((completedCount * 100) / manzanas.length);
  };

  const handlerEditButton = (areaKey, area) => {
    setEditButtonActive(prevState => {
      const newState = !prevState[areaKey];
      if (newState) {
        // Inicializar datos para edición
        setEditedTerritoryData(prev => ({
          ...prev,
          [areaKey]: {
            fechaInicio: area.fechaInicio || '',
            fechaFin: area.fechaFin || '',
            user: area.user || defaultUserName
          }
        }));
      }
      return { ...prevState, [areaKey]: newState };
    });
  };

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
    if (partesFecha.length !== 3) return null;
    return `${partesFecha[2]}-${partesFecha[0].padStart(2, '0')}-${partesFecha[1].padStart(2, '0')}`;
  };

  const handlerGuardarEdicion = async (areaKey) => {
    const editData = editedTerritoryData[areaKey] || {};
    const areaOriginal = territorioActivo?.mapa?.area?.[areaKey] || {};

    const fechaInicio = editData.fechaInicio !== undefined ? editData.fechaInicio : areaOriginal.fechaInicio;
    const fechaFin = editData.fechaFin !== undefined ? editData.fechaFin : areaOriginal.fechaFin;
    const publisher = editData.user !== undefined ? editData.user : areaOriginal.user;

    setLoadingAreas(prev => ({ ...prev, [areaKey]: true }));

    try {
      await updateTerritoryDetails(nombreGrupo, areaKey, {
        fechaInicio,
        fechaFin,
        user: publisher
      });

      setEditButtonActive(prev => ({ ...prev, [areaKey]: false }));
    } catch (error) {
      console.error("Error al actualizar territorio en Firebase: ", error);
      alert("Error al guardar la información. Intenta nuevamente.");
    } finally {
      setLoadingAreas(prev => ({ ...prev, [areaKey]: false }));
    }
  };

  // Reinicio y guardado INDIVIDUAL por territorio
  const handleSingleTerritoryArchiveAndRestart = async (areaKey, area) => {
    const terrName = area.name || areaKey;
    const confirmRestart = window.confirm(
      `¿Deseas archivar la asignación de ${terrName} (${area.user || 'Sin asignar'}) en el folio S-13-S y reiniciar sus casillas para la próxima vuelta?`
    );
    if (!confirmRestart) return;

    setLoadingAreas(prev => ({ ...prev, [areaKey]: true }));
    try {
      await archiveAndRestartSingleTerritory(nombreGrupo, areaKey);
      alert(`✅ ${terrName} archivado en el Folio S-13-S y reiniciado.`);
    } catch (error) {
      console.error("Error al archivar territorio individual:", error);
      alert("Error al archivar y reiniciar el territorio.");
    } finally {
      setLoadingAreas(prev => ({ ...prev, [areaKey]: false }));
    }
  };

  const handleGoToFolioTable = () => {
    navigateTo('/foliotable');
  };

  const handleGoToPDF = () => {
    navigateTo('/pdfvisualizer');
  };

  return (
    <>
      <NavbarApp />
      <div className='p-4 max-w-5xl mx-auto pb-24'>
        {/* Selector de Grupo */}
        <Card className="shadow-sm">
          <CardBody>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
              <div className='w-full sm:w-72'>
                <Select 
                  variant='bordered' 
                  label="Grupo de Predicación" 
                  selectedKeys={[nombreGrupo]}
                  onChange={(e) => handleSetGrupo(e.target.value)}
                >
                  {Object.keys(territorios).map(
                    (territorio) => <SelectItem key={territorio} value={territorio}>{territorio}</SelectItem>
                  )}
                </Select>
              </div>
              <div className='flex gap-2 w-full sm:w-auto'>
                <Button 
                  color="secondary" 
                  variant="flat"
                  onPress={handleGoToFolioTable}
                  className="flex-1 sm:flex-none font-medium"
                >
                  📋 Tabla de Folio (S-13-S)
                </Button>
                <Button 
                  color="primary" 
                  variant="flat"
                  onPress={handleGoToPDF}
                  className="flex-1 sm:flex-none font-medium"
                >
                  📄 Ver PDF
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {loading && !territorioActivo && (
          <div className="flex justify-center my-8">
            <Spinner color='secondary' label='Cargando información del grupo...' size='lg' />
          </div>
        )}

        {territorioActivo && territorioActivo.mapa && (
          <Card className='mt-4 shadow-md'>
            <CardHeader className='flex justify-between items-center bg-gray-50 border-b px-4 py-3'>
              <div>
                <h2 className='text-xl font-bold text-gray-800'>
                  Territorios del Grupo {territorioActivo.name}
                </h2>
                <p className="text-xs text-gray-500">
                  Edita y marca las manzanas completadas en vivo.
                </p>
              </div>
              {territorioActivo.mapa.imagen && (
                <Button 
                  size="sm"
                  color="default"
                  variant="bordered"
                  onPress={() => handleOpen(territorioActivo.mapa.imagen)}
                >
                  🗺️ Ver Mapa de Grupo
                </Button>
              )}
            </CardHeader>

            <CardBody id='territories' className="divide-y divide-gray-200 p-4">
              {territorioActivo.mapa.area && Object.entries(territorioActivo.mapa.area)
                .sort(([, areaA], [, areaB]) => {
                  const numA = parseInt(areaA.name?.replace(/\D/g, '')) || 0;
                  const numB = parseInt(areaB.name?.replace(/\D/g, '')) || 0;
                  return numA - numB;
                })
                .map(([areaKey, area]) => {
                  const progress = calculateProgress(area.manzanas);
                  const is100Percent = progress === 100;
                  const isEditing = editButtonActive[areaKey];
                  const currentEdit = editedTerritoryData[areaKey] || {};

                  return (
                    <React.Fragment key={areaKey}>
                      <div className="py-4">
                        {loadingAreas[areaKey] && (
                          <div className='flex justify-center items-center py-2'>
                            <Spinner color='secondary' label='Guardando cambios...' size='sm' />
                          </div>
                        )}

                        {/* Encabezado del Territorio */}
                        <div className='flex flex-wrap justify-between items-center gap-2 mb-2'>
                          <div className="flex items-center gap-2">
                            <h3 className='text-lg font-bold text-gray-800'>
                              {area.name}
                            </h3>
                            {is100Percent && (
                              <Chip color="success" size="sm" variant="flat">
                                Completado 100% ✅
                              </Chip>
                            )}
                            {area.user && (
                              <Chip color="primary" size="sm" variant="dot">
                                {area.user}
                              </Chip>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Botón de reinicio individual cuando se completa */}
                            {(is100Percent || area.fechaFin) && !isEditing && (
                              <Button 
                                size="sm" 
                                color="success" 
                                variant="solid"
                                onPress={() => handleSingleTerritoryArchiveAndRestart(areaKey, area)}
                              >
                                📥 Archivar y Reiniciar
                              </Button>
                            )}

                            <Button 
                              size="sm"
                              variant={isEditing ? "flat" : "light"}
                              color={isEditing ? "danger" : "default"}
                              onPress={() => handlerEditButton(areaKey, area)}
                            >
                              {isEditing ? '❌ Cancelar' : '📝 Editar'}
                            </Button>
                          </div>
                        </div>

                        {/* Panel de Edición Rápida (Nombres + Fechas) */}
                        {isEditing && (
                          <div className='flex flex-col gap-3 rounded-lg p-3 bg-purple-50 border border-purple-200 mb-3'>
                            <p className="text-xs font-semibold text-purple-900">
                              Modificar asignación y fechas del territorio:
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                              {/* 0.1 Campo de Publicador Editable */}
                              <div>
                                <Input
                                  size="sm"
                                  label="Asignado a (Publicador):"
                                  placeholder="Ej: D. Cabrera"
                                  value={currentEdit.user !== undefined ? currentEdit.user : (area.user || '')}
                                  onValueChange={(val) => {
                                    setEditedTerritoryData(prev => ({
                                      ...prev,
                                      [areaKey]: { ...prev[areaKey], user: val }
                                    }));
                                  }}
                                />
                              </div>

                              <div>
                                <DatePicker 
                                  size="sm"
                                  key={`fecha-inicio-${areaKey}`}
                                  label="Fecha de inicio:"
                                  defaultValue={receivedDateHyphenFormat(area.fechaInicio) ? parseDate(receivedDateHyphenFormat(area.fechaInicio)) : null}
                                  onChange={(e) => {
                                    const fechaFormateada = formatearFecha(e);
                                    setEditedTerritoryData(prev => ({
                                      ...prev,
                                      [areaKey]: { ...prev[areaKey], fechaInicio: fechaFormateada }
                                    }));
                                  }} 
                                />
                              </div>

                              <div>
                                <DatePicker 
                                  size="sm"
                                  key={`fecha-fin-${areaKey}`}
                                  label="Fecha completado:"
                                  defaultValue={receivedDateHyphenFormat(area.fechaFin) ? parseDate(receivedDateHyphenFormat(area.fechaFin)) : null}
                                  onChange={(e) => {
                                    const fechaFormateada = formatearFecha(e);
                                    setEditedTerritoryData(prev => ({
                                      ...prev,
                                      [areaKey]: { ...prev[areaKey], fechaFin: fechaFormateada }
                                    }));
                                  }} 
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-1">
                              <Button 
                                size='sm' 
                                color="secondary"
                                onPress={() => handlerGuardarEdicion(areaKey)}
                              >
                                💾 Guardar Cambios
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Información de Fechas y Publicador */}
                        {!isEditing && (
                          <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mb-2'>
                            <span>
                              <strong>Iniciado:</strong> {area.fechaInicio || "Por iniciar"}
                            </span>
                            <span>•</span>
                            <span>
                              <strong>Finalizado:</strong> {area.fechaFin || "En progreso"}
                            </span>
                            {area.user && (
                              <>
                                <span>•</span>
                                <span>
                                  <strong>Publicador:</strong> {area.user}
                                </span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Barra de Progreso y Manzanas */}
                        <div className={area.fechaFin && !isEditing ? 'opacity-90' : ''}>
                          <Progress
                            className='my-2'
                            size="sm"
                            label='Progreso de manzanas'
                            value={progress}
                            color={is100Percent ? "success" : "primary"}
                            showValueLabel
                          />
                          <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2 mt-2'>
                            {area.manzanas && area.manzanas.map((item, index) => (
                              <Checkbox
                                key={index}
                                size="sm"
                                isSelected={Boolean(item.completed)}
                                onChange={(e) => {
                                  e.preventDefault();
                                  handleCheckboxChange(areaKey, index);
                                }}
                              >
                                <span className="text-xs">{item.name}</span>
                              </Checkbox>
                            ))}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
            </CardBody>
          </Card>
        )}
      </div>

      {/* Modal de Imagen del Mapa */}
      <Modal placement="center" backdrop='blur' isOpen={isOpen} onClose={handleClose}>
        <ModalContent>
          <ModalBody className="p-4">
            <h4 className="font-bold text-sm mb-2">Mapa del Territorio</h4>
            <Image 
              src={`assets/${mapaTerritorio}`} 
              alt='Territorio' 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <FooterNavbar />
    </>
  );
};

export default GroupSelector;

