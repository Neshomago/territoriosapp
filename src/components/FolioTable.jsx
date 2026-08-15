import React, { useState, useMemo } from 'react';
import { 
  Button, 
  Select, 
  SelectItem, 
  Input, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  useDisclosure, 
  Chip,
  Tooltip
} from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import NavbarApp from './NavbarApp';
import FooterNavbar from './FooterNavbar';
import { useDatosGrupoContext } from './contexts/grupoContext';
import { territorios } from './utils/_utils';

export const FolioTable = () => {
  const { 
    nombreGrupo, 
    setNombreGrupo, 
    folioRecords, 
    saveFolioRecord, 
    deleteFolioRecord, 
    territorioActivo 
  } = useDatosGrupoContext();

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Filtro de año de servicio
  const currentYear = new Date().getFullYear();
  const defaultServiceYear = String(new Date().getMonth() >= 8 ? currentYear + 1 : currentYear);
  const [serviceYear, setServiceYear] = useState(defaultServiceYear);

  // Estado para modal de edición/creación
  const [modalMode, setModalMode] = useState('edit'); // 'create' | 'edit'
  const [currentEditRecord, setCurrentEditRecord] = useState({
    id: null,
    grupo: nombreGrupo,
    territorioNumero: 1,
    publicador: '',
    fechaInicio: '',
    fechaFin: '',
    yearServicio: defaultServiceYear,
    completado: true
  });

  // Extraer número de territorios totales del grupo
  const totalTerritorios = useMemo(() => {
    if (territorioActivo?.mapa?.area) {
      return Object.keys(territorioActivo.mapa.area).length;
    }
    const staticGroup = territorios[nombreGrupo];
    if (staticGroup?.mapa?.area) {
      return Object.keys(staticGroup.mapa.area).length;
    }
    return 15;
  }, [territorioActivo, nombreGrupo]);

  // Agrupar registros por número de territorio (1..N) para la vista S-13-S (máx 4 asignaciones por fila)
  const groupedTerritories = useMemo(() => {
    const list = [];
    for (let num = 1; num <= totalTerritorios; num++) {
      const recordsForTerr = folioRecords.filter(r => 
        parseInt(r.territorioNumero) === num && 
        (!serviceYear || String(r.yearServicio || '') === String(serviceYear) || !r.yearServicio)
      );

      // Ordenar por fecha de inicio
      recordsForTerr.sort((a, b) => (a.fechaInicio || '').localeCompare(b.fechaInicio || ''));

      // Obtener la última fecha completada
      const completedDates = recordsForTerr
        .filter(r => r.fechaFin)
        .map(r => r.fechaFin);
      const lastCompletedDate = completedDates.length > 0 
        ? completedDates[completedDates.length - 1] 
        : '';

      list.push({
        territoryNumber: num,
        lastCompletedDate,
        assignments: recordsForTerr
      });
    }
    return list;
  }, [folioRecords, totalTerritorios, serviceYear]);

  const handleOpenCreateModal = (territoryNumber = 1) => {
    setModalMode('create');
    setCurrentEditRecord({
      id: null,
      grupo: nombreGrupo,
      territorioNumero: territoryNumber,
      publicador: '',
      fechaInicio: '',
      fechaFin: '',
      yearServicio: serviceYear,
      completado: true
    });
    onOpen();
  };

  const handleOpenEditModal = (record) => {
    setModalMode('edit');
    setCurrentEditRecord({
      id: record.id,
      grupo: record.grupo || nombreGrupo,
      territorioNumero: record.territorioNumero,
      publicador: record.publicador || '',
      fechaInicio: record.fechaInicio || '',
      fechaFin: record.fechaFin || '',
      yearServicio: record.yearServicio || serviceYear,
      completado: record.completado !== undefined ? record.completado : true
    });
    onOpen();
  };

  const handleSaveModalRecord = async () => {
    if (!currentEditRecord.territorioNumero) {
      alert("Por favor indica el número de territorio");
      return;
    }
    if (!currentEditRecord.publicador && !currentEditRecord.fechaInicio) {
      alert("Por favor ingresa al menos el nombre del publicador o fecha de inicio");
      return;
    }

    try {
      await saveFolioRecord(currentEditRecord);
      onClose();
    } catch (err) {
      console.error("Error al guardar registro:", err);
      alert("Error al guardar el registro en Firebase");
    }
  };

  const handleDeleteRecord = async (recordId, territoryNumber) => {
    const confirmDelete = window.confirm(
      `¿Deseas eliminar esta asignación del territorio ${territoryNumber}?`
    );
    if (!confirmDelete) return;

    try {
      await deleteFolioRecord(recordId);
    } catch (err) {
      console.error("Error al eliminar registro:", err);
      alert("Error al eliminar el registro");
    }
  };

  const handleGoToPDF = () => {
    navigate('/pdfvisualizer');
  };

  const handleGoToMap = () => {
    navigate('/grupo');
  };

  return (
    <>
      <NavbarApp />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-nav-safe">
        
        {/* Header & Controls */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-ambient border border-surface-container mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider block">
                Registro Oficial Teocrático
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
                Editor de Folio S-13-S
              </h1>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Audita y administra las asignaciones de territorios antes de emitir el formulario oficial.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="w-44">
                <Select 
                  variant="bordered"
                  size="sm"
                  label="Grupo"
                  selectedKeys={[nombreGrupo]}
                  onChange={(e) => setNombreGrupo(e.target.value)}
                  classNames={{
                    trigger: "rounded-2xl border-surface-container bg-surface-container-low/50",
                  }}
                >
                  {Object.keys(territorios).map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="w-32">
                <Input 
                  size="sm"
                  variant="bordered"
                  label="Año servicio"
                  value={serviceYear}
                  onValueChange={setServiceYear}
                  classNames={{
                    inputWrapper: "rounded-2xl border-surface-container bg-surface-container-low/50",
                  }}
                />
              </div>

              <Button 
                size="sm"
                color="secondary"
                variant="flat"
                onPress={() => handleOpenCreateModal(1)}
                className="rounded-full font-bold"
                startContent={<span className="material-symbols-outlined text-[18px]">add</span>}
              >
                Nueva Asignación
              </Button>

              <Button 
                size="sm"
                color="primary"
                variant="solid"
                onPress={handleGoToPDF}
                className="rounded-full font-bold shadow-sm"
                startContent={<span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>}
              >
                Generar PDF S-13-S
              </Button>
            </div>
          </div>
        </section>

        {/* Tabla Principal S-13-S */}
        <section className="bg-white rounded-3xl shadow-ambient border border-surface-container overflow-hidden">
          <div className="bg-surface-container-low/60 border-b border-surface-container px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-on-surface">
                Grupo <span className="text-primary">{nombreGrupo}</span> • Año de Servicio {serviceYear}
              </span>
              <Chip size="sm" variant="flat" className="font-mono text-xs bg-purple-100 text-primary">
                {folioRecords.length} asignaciones
              </Chip>
            </div>
            <Button 
              size="sm" 
              variant="light" 
              color="primary" 
              onPress={handleGoToMap}
              className="rounded-full font-semibold text-xs"
              startContent={<span className="material-symbols-outlined text-[16px]">map</span>}
            >
              Ver Cuadrícula de Manzanas
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low text-on-surface uppercase font-mono font-bold text-[11px] border-b border-surface-container">
                  <th className="p-3 border-r border-surface-container text-center w-14">Terr.</th>
                  <th className="p-3 border-r border-surface-container text-center w-28">Última Fecha</th>
                  <th className="p-3 border-r border-surface-container text-center" colSpan={3}>Asignación 1</th>
                  <th className="p-3 border-r border-surface-container text-center" colSpan={3}>Asignación 2</th>
                  <th className="p-3 border-r border-surface-container text-center" colSpan={3}>Asignación 3</th>
                  <th className="p-3 border-r border-surface-container text-center" colSpan={3}>Asignación 4</th>
                  <th className="p-3 text-center w-14">Acción</th>
                </tr>
                <tr className="bg-surface-container-lowest text-on-surface-variant font-medium border-b border-surface-container text-[10px]">
                  <th className="p-1 border-r border-surface-container"></th>
                  <th className="p-1 border-r border-surface-container"></th>
                  {[1, 2, 3, 4].map((i) => (
                    <React.Fragment key={i}>
                      <th className="p-1.5 border-r border-surface-container font-semibold">Publicador</th>
                      <th className="p-1.5 border-r border-surface-container w-16 text-center">Inicio</th>
                      <th className="p-1.5 border-r border-surface-container w-16 text-center">Fin</th>
                    </React.Fragment>
                  ))}
                  <th className="p-1"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container bg-white">
                {groupedTerritories.map((row) => {
                  return (
                    <tr key={row.territoryNumber} className="hover:bg-purple-50/40 transition-colors">
                      {/* Número de Territorio */}
                      <td className="p-3 border-r border-surface-container text-center font-extrabold text-primary bg-surface-container-lowest/50 font-mono">
                        #{row.territoryNumber}
                      </td>

                      {/* Última fecha completado */}
                      <td className="p-3 border-r border-surface-container text-center font-mono text-on-surface-variant bg-surface-container-lowest/50">
                        {row.lastCompletedDate ? (
                          <span className="font-semibold text-emerald-700">{row.lastCompletedDate}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* 4 Columnas de Asignaciones */}
                      {[0, 1, 2, 3].map((colIdx) => {
                        const assign = row.assignments[colIdx];
                        return (
                          <React.Fragment key={colIdx}>
                            {/* Publicador */}
                            <td className="p-2.5 border-r border-surface-container font-medium">
                              {assign ? (
                                <div className="flex items-center justify-between group gap-1">
                                  <span className="truncate max-w-[95px] font-semibold text-on-surface">
                                    {assign.publicador || 'Sin nombre'}
                                  </span>
                                  <button 
                                    type="button"
                                    onClick={() => handleOpenEditModal(assign)} 
                                    className="opacity-0 group-hover:opacity-100 text-primary hover:text-primary-dark transition-opacity"
                                    title="Editar asignación"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">edit</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>

                            {/* Fecha Inicio */}
                            <td className="p-2.5 border-r border-surface-container text-center font-mono text-[11px] text-on-surface-variant">
                              {assign?.fechaInicio || '—'}
                            </td>

                            {/* Fecha Fin */}
                            <td className="p-2.5 border-r border-surface-container text-center font-mono text-[11px]">
                              {assign ? (
                                <div className="flex items-center justify-center gap-1">
                                  <span className={assign.fechaFin ? 'text-emerald-700 font-medium' : 'text-amber-600 font-medium'}>
                                    {assign.fechaFin || 'En curso'}
                                  </span>
                                  {assign.id && (
                                    <button 
                                      type="button"
                                      onClick={() => handleDeleteRecord(assign.id, row.territoryNumber)}
                                      className="text-red-400 hover:text-red-600 opacity-60 hover:opacity-100 transition-opacity"
                                      title="Eliminar esta asignación"
                                    >
                                      <span className="material-symbols-outlined text-[14px]">delete</span>
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          </React.Fragment>
                        );
                      })}

                      {/* Acciones de Fila */}
                      <td className="p-2 text-center">
                        <button 
                          type="button"
                          onClick={() => handleOpenCreateModal(row.territoryNumber)}
                          className="w-7 h-7 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center mx-auto transition-all active-scale"
                          title="Añadir asignación a este territorio"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal de Creación / Edición de Asignación */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        placement="center"
        classNames={{
          base: "rounded-3xl shadow-ambient-hover",
        }}
      >
        <ModalContent>
          <ModalHeader className="font-bold text-base text-on-surface px-6 pt-5 pb-0">
            {modalMode === 'create' ? 'Registrar Nueva Asignación' : 'Editar Asignación'}
          </ModalHeader>
          <ModalBody className="p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input 
                type="number"
                label="Número de Territorio"
                value={String(currentEditRecord.territorioNumero)}
                onValueChange={(val) => setCurrentEditRecord(prev => ({ ...prev, territorioNumero: parseInt(val) || 1 }))}
                classNames={{
                  inputWrapper: "rounded-xl bg-white border-surface-container",
                }}
              />
              <Input 
                label="Año de Servicio"
                value={currentEditRecord.yearServicio}
                onValueChange={(val) => setCurrentEditRecord(prev => ({ ...prev, yearServicio: val }))}
                classNames={{
                  inputWrapper: "rounded-xl bg-white border-surface-container",
                }}
              />
            </div>

            <Input 
              label="Publicador Asignado"
              placeholder="Ej: D. Cabrera o M. Tinoco"
              value={currentEditRecord.publicador}
              onValueChange={(val) => setCurrentEditRecord(prev => ({ ...prev, publicador: val }))}
              classNames={{
                inputWrapper: "rounded-xl bg-white border-surface-container",
              }}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input 
                label="Fecha de Inicio (MM/DD/YYYY)"
                placeholder="Ej: 05/24/2025"
                value={currentEditRecord.fechaInicio}
                onValueChange={(val) => setCurrentEditRecord(prev => ({ ...prev, fechaInicio: val }))}
                classNames={{
                  inputWrapper: "rounded-xl bg-white border-surface-container",
                }}
              />
              <Input 
                label="Fecha de Fin (MM/DD/YYYY)"
                placeholder="Ej: 07/24/2025"
                value={currentEditRecord.fechaFin}
                onValueChange={(val) => setCurrentEditRecord(prev => ({ ...prev, fechaFin: val }))}
                classNames={{
                  inputWrapper: "rounded-xl bg-white border-surface-container",
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter className="px-6 pb-5 pt-0">
            <Button variant="light" color="danger" onPress={onClose} className="rounded-full font-semibold">
              Cancelar
            </Button>
            <Button color="primary" onPress={handleSaveModalRecord} className="rounded-full font-bold shadow-sm">
              Guardar Registro
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <FooterNavbar />
    </>
  );
};

export default FolioTable;