import {
  Button,
  Card,
  CardBody,
  Progress,
  useDisclosure,
  Input,
  Chip,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Image,
  Spinner,
  Select,
  SelectItem
} from '@heroui/react';
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
  const defaultUserName = user?.displayName ? `${user.displayName[0]}. ${user.displayName.split(' ')[1] || ''}` : '';

  const handleSetGrupo = (value) => {
    if (value) setNombreGrupo(value);
  };

  const handleOpen = (terr) => {
    setMapaTerritorio("")
    const cleanUrl = terr.replace(/^https?:\/\/localhost:\d+(\/src\/components\/assets\/)?/, '');
    setMapaTerritorio(cleanUrl);
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

  return (
    <>
      <NavbarApp />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-nav-safe">

        {/* Header & Group Control Card */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-ambient border border-surface-container mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider block">
                Gestión de Predicación
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
                Territorios por Manzanas
              </h1>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Marca casillas completadas y actualiza asignaciones en vivo.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="w-full sm:w-60">
                <Select
                  variant="bordered"
                  size="sm"
                  label="Grupo de Predicación"
                  selectedKeys={[nombreGrupo]}
                  onChange={(e) => handleSetGrupo(e.target.value)}
                  classNames={{
                    trigger: "rounded-2xl border-surface-container bg-surface-container-low/50",
                  }}
                >
                  {Object.keys(territorios).map(
                    (territorio) => <SelectItem key={territorio} value={territorio}>{territorio}</SelectItem>
                  )}
                </Select>
              </div>

              {territorioActivo?.mapa?.imagen && (
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={() => handleOpen(territorioActivo.mapa.imagen)}
                  className="rounded-full font-semibold"
                  startContent={<span className="material-symbols-outlined text-[18px]">map</span>}
                >
                  Ver Mapa General
                </Button>
              )}

              <Button
                size="sm"
                variant="flat"
                color="secondary"
                onPress={() => navigateTo('/foliotable')}
                className="rounded-full font-semibold"
                startContent={<span className="material-symbols-outlined text-[18px]">table_chart</span>}
              >
                Folio S-13-S
              </Button>
            </div>
          </div>
        </section>

        {loading && !territorioActivo && (
          <div className="flex justify-center items-center py-16">
            <Spinner color="primary" label="Cargando información del grupo..." size="lg" />
          </div>
        )}

        {/* Territory Cards List */}
        {territorioActivo && territorioActivo.mapa && (
          <div className="space-y-6">
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
                const totalManzanas = area.manzanas ? area.manzanas.length : 0;
                const completedCount = area.manzanas ? area.manzanas.filter(m => m.completed).length : 0;

                return (
                  <div
                    key={areaKey}
                    className={`bg-white rounded-3xl shadow-ambient border transition-all duration-300 overflow-hidden ${is100Percent
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-surface-container'
                      }`}
                  >
                    <div className="p-5 sm:p-6">
                      {loadingAreas[areaKey] && (
                        <div className="flex justify-center items-center py-2 mb-2">
                          <Spinner color="primary" label="Guardando cambios..." size="sm" />
                        </div>
                      )}

                      {/* Header row of territory */}
                      <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-bold text-on-surface">
                            {area.name}
                          </h3>

                          {is100Percent ? (
                            <Chip
                              size="sm"
                              variant="flat"
                              className="bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-full border border-emerald-300"
                              startContent={<span className="material-symbols-outlined text-[16px] mr-0.5">check_circle</span>}
                            >
                              Completado 100%
                            </Chip>
                          ) : (
                            <Chip
                              size="sm"
                              variant="flat"
                              className="bg-purple-100 text-primary font-semibold text-xs rounded-full font-mono"
                            >
                              {completedCount} / {totalManzanas} completadas
                            </Chip>
                          )}

                          {area.user && (
                            <Chip
                              size="sm"
                              variant="dot"
                              color="primary"
                              className="font-medium text-xs rounded-full"
                            >
                              Asignado: {area.user}
                            </Chip>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          {(is100Percent || area.fechaFin) && !isEditing && (
                            <Button
                              size="sm"
                              color="success"
                              variant="solid"
                              onPress={() => handleSingleTerritoryArchiveAndRestart(areaKey, area)}
                              className="rounded-full text-xs font-bold text-white shadow-sm"
                              startContent={<span className="material-symbols-outlined text-[16px]">inventory_2</span>}
                            >
                              Archivar y Reiniciar
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant={isEditing ? "flat" : "light"}
                            color={isEditing ? "danger" : "primary"}
                            onPress={() => handlerEditButton(areaKey, area)}
                            className="rounded-full text-xs font-semibold"
                            startContent={<span className="material-symbols-outlined text-[16px]">{isEditing ? 'close' : 'edit'}</span>}
                          >
                            {isEditing ? 'Cancelar' : 'Editar Asignación'}
                          </Button>
                        </div>
                      </div>

                      {/* Quick Edit inline panel */}
                      {isEditing && (
                        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 mb-4 transition-all">
                          <p className="text-xs font-bold text-primary mb-3 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                            Modificar publicador y fechas de este territorio:
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                            <div>
                              <Input
                                size="sm"
                                label="Publicador asignado"
                                placeholder="Ej: D. Cabrera"
                                value={currentEdit.user !== undefined ? currentEdit.user : (area.user || '')}
                                onValueChange={(val) => {
                                  setEditedTerritoryData(prev => ({
                                    ...prev,
                                    [areaKey]: { ...prev[areaKey], user: val }
                                  }));
                                }}
                                classNames={{
                                  inputWrapper: "rounded-xl bg-white border-surface-container",
                                }}
                              />
                            </div>

                            <div>
                              <DatePicker
                                size="sm"
                                key={`fecha-inicio-${areaKey}`}
                                label="Fecha de inicio"
                                defaultValue={receivedDateHyphenFormat(area.fechaInicio) ? parseDate(receivedDateHyphenFormat(area.fechaInicio)) : null}
                                onChange={(e) => {
                                  const fechaFormateada = formatearFecha(e);
                                  setEditedTerritoryData(prev => ({
                                    ...prev,
                                    [areaKey]: { ...prev[areaKey], fechaInicio: fechaFormateada }
                                  }));
                                }}
                                classNames={{
                                  calendarContent: "rounded-2xl",
                                }}
                              />
                            </div>

                            <div>
                              <DatePicker
                                size="sm"
                                key={`fecha-fin-${areaKey}`}
                                label="Fecha completado"
                                defaultValue={receivedDateHyphenFormat(area.fechaFin) ? parseDate(receivedDateHyphenFormat(area.fechaFin)) : null}
                                onChange={(e) => {
                                  const fechaFormateada = formatearFecha(e);
                                  setEditedTerritoryData(prev => ({
                                    ...prev,
                                    [areaKey]: { ...prev[areaKey], fechaFin: fechaFormateada }
                                  }));
                                }}
                                classNames={{
                                  calendarContent: "rounded-2xl",
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-3">
                            <Button
                              size="sm"
                              color="primary"
                              onPress={() => handlerGuardarEdicion(areaKey)}
                              className="rounded-full font-bold px-4"
                              startContent={<span className="material-symbols-outlined text-[16px]">save</span>}
                            >
                              Guardar Cambios
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Dates and Publisher metadata */}
                      {!isEditing && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant font-medium mb-3">
                          <span className="flex items-center gap-1">
                            <strong className="text-on-surface">Iniciado:</strong>
                            <span className="font-mono">{area.fechaInicio || "Por iniciar"}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <strong className="text-on-surface">Finalizado:</strong>
                            <span className="font-mono">{area.fechaFin || "En progreso"}</span>
                          </span>
                          {area.user && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <strong className="text-on-surface">Publicador:</strong> {area.user}
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-on-surface-variant">Progreso del Territorio</span>
                          <span className={`font-mono font-bold ${is100Percent ? 'text-emerald-700' : 'text-primary'}`}>
                            {progress}%
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${is100Percent ? 'bg-emerald-600' : 'bg-primary'
                              }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Manzanas Tactile Chips Grid */}
                      <div className="pt-2">
                        <p className="text-xs font-mono font-semibold text-on-surface-variant uppercase tracking-wider mb-2.5">
                          Manzanas asignadas ({totalManzanas}):
                        </p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                          {area.manzanas && area.manzanas.map((item, index) => {
                            const isChecked = Boolean(item.completed);
                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCheckboxChange(areaKey, index);
                                }}
                                className={`flex items-center justify-center gap-1 py-2 px-2.5 rounded-2xl text-xs font-mono font-bold transition-all duration-200 active-scale border ${isChecked
                                  ? 'bg-primary text-white border-primary shadow-sm hover:bg-primary-dark'
                                  : 'bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container hover:border-surface-dim'
                                  }`}
                              >
                                {isChecked && (
                                  <span className="material-symbols-outlined text-[14px] text-white">
                                    check
                                  </span>
                                )}
                                <span>{item.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </main>

      {/* Modal de Imagen del Mapa */}
      <Modal
        placement="center"
        backdrop="blur"
        isOpen={isOpen}
        onClose={handleClose}
        classNames={{
          base: "rounded-3xl shadow-ambient-hover",
        }}
      >
        <ModalContent>
          <ModalHeader className="font-bold text-base text-on-surface px-6 pt-5 pb-0">
            Mapa General del Territorio
          </ModalHeader>
          <ModalBody className="p-6">
            <Image
              src={`assets/${mapaTerritorio}`}
              alt="Territorio"
              className="w-full h-auto rounded-2xl shadow-md border border-surface-container"
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <FooterNavbar />
    </>
  );
};

export default GroupSelector;

