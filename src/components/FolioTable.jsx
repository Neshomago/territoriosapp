import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
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
    bulkUpdateFolioRecords, 
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

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [localRows, setLocalRows] = useState([]);

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
      <div className="p-4 max-w-7xl mx-auto pb-28">
        
        {/* Cabecera y Controles */}
        <Card className="mb-4 shadow-sm">
          <CardBody>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  📊 Editor de Folio S-13-S
                </h1>
                <p className="text-xs text-gray-500">
                  Revisa, audita y edita las asignaciones de territorios antes de emitir el formulario oficial S-13-S.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="w-48">
                  <Select 
                    variant="bordered"
                    size="sm"
                    label="Grupo"
                    selectedKeys={[nombreGrupo]}
                    onChange={(e) => setNombreGrupo(e.target.value)}
                  >
                    {Object.keys(territorios).map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="w-36">
                  <Input 
                    size="sm"
                    variant="bordered"
                    label="Año de servicio"
                    value={serviceYear}
                    onValueChange={setServiceYear}
                  />
                </div>

                <Button 
                  size="sm"
                  color="secondary"
                  variant="solid"
                  onPress={() => handleOpenCreateModal(1)}
                >
                  ➕ Nueva Asignación
                </Button>

                <Button 
                  size="sm"
                  color="success"
                  variant="solid"
                  onPress={handleGoToPDF}
                  className="font-semibold"
                >
                  📄 Generar PDF S-13-S
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tabla Principal S-13-S */}
        <Card className="shadow-md overflow-hidden">
          <CardHeader className="bg-gray-100 border-b px-4 py-3 flex justify-between items-center">
            <span className="font-bold text-sm text-gray-700">
              Registros del Grupo {nombreGrupo} • Año de Servicio {serviceYear} ({folioRecords.length} asignaciones registradas)
            </span>
            <Button size="sm" variant="light" color="primary" onPress={handleGoToMap}>
              🗺️ Ir al Marcador de Manzanas
            </Button>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase font-semibold border-b border-gray-300">
                  <th className="p-2 border-r border-gray-300 text-center w-14">Núm. Terr.</th>
                  <th className="p-2 border-r border-gray-300 text-center w-24">Última Fecha Completado</th>
                  <th className="p-2 border-r border-gray-300 text-center" colSpan={3}>Asignación 1</th>
                  <th className="p-2 border-r border-gray-300 text-center" colSpan={3}>Asignación 2</th>
                  <th className="p-2 border-r border-gray-300 text-center" colSpan={3}>Asignación 3</th>
                  <th className="p-2 border-r border-gray-300 text-center" colSpan={3}>Asignación 4</th>
                  <th className="p-2 text-center w-16">Acciones</th>
                </tr>
                <tr className="bg-gray-100 text-gray-600 font-medium border-b border-gray-300 text-[11px]">
                  <th className="p-1 border-r border-gray-300"></th>
                  <th className="p-1 border-r border-gray-300"></th>
                  {[1, 2, 3, 4].map((i) => (
                    <React.Fragment key={i}>
                      <th className="p-1 border-r border-gray-200">Publicador</th>
                      <th className="p-1 border-r border-gray-200 w-16 text-center">Inicio</th>
                      <th className="p-1 border-r border-gray-300 w-16 text-center">Fin</th>
                    </React.Fragment>
                  ))}
                  <th className="p-1"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {groupedTerritories.map((row) => {
                  return (
                    <tr key={row.territoryNumber} className="hover:bg-blue-50 transition-colors">
                      {/* Número de Territorio */}
                      <td className="p-2 border-r border-gray-300 text-center font-bold text-gray-800 bg-gray-50">
                        {row.territoryNumber}
                      </td>

                      {/* Última fecha completado */}
                      <td className="p-2 border-r border-gray-300 text-center font-mono text-gray-600 bg-gray-50">
                        {row.lastCompletedDate || '—'}
                      </td>

                      {/* 4 Columnas de Asignaciones */}
                      {[0, 1, 2, 3].map((colIdx) => {
                        const assign = row.assignments[colIdx];
                        return (
                          <React.Fragment key={colIdx}>
                            {/* Publicador */}
                            <td className="p-2 border-r border-gray-200 font-medium">
                              {assign ? (
                                <div className="flex items-center justify-between group">
                                  <span className="truncate max-w-[100px]">{assign.publicador || 'Sin nombre'}</span>
                                  <button 
                                    onClick={() => handleOpenEditModal(assign)} 
                                    className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 ml-1 text-xs"
                                    title="Editar"
                                  >
                                    ✏️
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>

                            {/* Fecha Inicio */}
                            <td className="p-2 border-r border-gray-200 text-center font-mono text-[11px]">
                              {assign?.fechaInicio || '—'}
                            </td>

                            {/* Fecha Fin */}
                            <td className="p-2 border-r border-gray-300 text-center font-mono text-[11px]">
                              {assign ? (
                                <div className="flex items-center justify-center gap-1">
                                  <span>{assign.fechaFin || 'En curso'}</span>
                                  {assign.id && (
                                    <button 
                                      onClick={() => handleDeleteRecord(assign.id, row.territoryNumber)}
                                      className="text-red-400 hover:text-red-600 text-[10px]"
                                      title="Eliminar esta asignación"
                                    >
                                      ❌
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
                        <Button 
                          size="sm" 
                          variant="light" 
                          color="primary"
                          className="min-w-0 px-2 h-7"
                          onPress={() => handleOpenCreateModal(row.territoryNumber)}
                          title="Añadir asignación a este territorio"
                        >
                          ➕
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal de Creación / Edición de Asignación */}
      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          <ModalHeader className="border-b">
            {modalMode === 'create' ? '➕ Registrar Nueva Asignación' : '📝 Editar Asignación'}
          </ModalHeader>
          <ModalBody className="py-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Input 
                type="number"
                label="Número de Territorio"
                value={String(currentEditRecord.territorioNumero)}
                onValueChange={(val) => setCurrentEditRecord(prev => ({ ...prev, territorioNumero: parseInt(val) || 1 }))}
              />
              <Input 
                label="Año de Servicio"
                value={currentEditRecord.yearServicio}
                onValueChange={(val) => setCurrentEditRecord(prev => ({ ...prev, yearServicio: val }))}
              />
            </div>

            {/* 0.1 Campo para Editar Nombre del Publicador */}
            <Input 
              label="Publicador Asignado"
              placeholder="Ej: D. Cabrera o M. Tinoco"
              value={currentEditRecord.publicador}
              onValueChange={(val) => setCurrentEditRecord(prev => ({ ...prev, publicador: val }))}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input 
                label="Fecha de Inicio (MM/DD/YYYY)"
                placeholder="Ej: 05/24/2025"
                value={currentEditRecord.fechaInicio}
                onValueChange={(val) => setCurrentEditRecord(prev => ({ ...prev, fechaInicio: val }))}
              />
              <Input 
                label="Fecha de Fin (MM/DD/YYYY)"
                placeholder="Ej: 07/24/2025"
                value={currentEditRecord.fechaFin}
                onValueChange={(val) => setCurrentEditRecord(prev => ({ ...prev, fechaFin: val }))}
              />
            </div>
          </ModalBody>
          <ModalFooter className="border-t">
            <Button variant="light" color="danger" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" onPress={handleSaveModalRecord}>
              💾 Guardar Registro
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <FooterNavbar />
    </>
  );
};

export default FolioTable;