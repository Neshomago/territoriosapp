import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Button,
  Progress,
  Chip,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  AvatarGroup
} from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import NavbarApp from './NavbarApp';
import FooterNavbar from './FooterNavbar';
import { useDatosGrupoContext } from './contexts/grupoContext';

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { nombreGrupo, folioRecords, territorioActivo } = useDatosGrupoContext();
  const [searchTerm, setSearchTerm] = useState('');

  const handleGrupos = () => {
    navigate('/grupo');
  };

  const handleFolio = () => {
    navigate('/foliotable');
  };

  const handlePDF = () => {
    navigate('/pdfvisualizer');
  };

  // Casas No Predicar Data
  const casasNoPredicar = [
    { id: '1', etapa: '4ta', mz: 'EC', villa: '6', ref: 'Al lado del hno. Otto', fecha: '08-Jul-2025' },
    { id: '2', etapa: '4ta', mz: 'DP', villa: '6 o 12', ref: 'Tercera casa a la izquierda de la villa 9', fecha: '19-Jul-2025' },
    { id: '3', etapa: '4ta', mz: 'DC', villa: '2', ref: 'No tocar timbre', fecha: '07-Jul-2025' },
    { id: '4', etapa: '4ta', mz: 'FO', villa: '??', ref: 'Techo rojo al lado de hna Norika', fecha: '16-Jul-2025' },
    { id: '5', etapa: '4ta', mz: 'DC', villa: '11', ref: 'Perro guardián en entrada', fecha: '02-Ago-2025' },
    { id: '6', etapa: '4ta', mz: 'DM', villa: '6', ref: 'Solicita no ser visitado', fecha: '06-Ago-2025' },
    { id: '7', etapa: '4ta', mz: 'FL', villa: '6', ref: 'Hablan inglés únicamente', fecha: '06-Ago-2025' },
    { id: '8', etapa: '5ta', mz: 'CX', villa: '2', ref: 'Horario especial tarde', fecha: '02-Ago-2025' },
    { id: '9', etapa: '9na', mz: '934', villa: '1', ref: 'Frente al parque central', fecha: '26-Jul-2025' },
    { id: '10', etapa: '9na', mz: '928', villa: '15', ref: 'Portón negro', fecha: '02-Ago-2025' },
    { id: '11', etapa: '5ta', mz: 'IF', villa: '9', ref: 'No desea lo visiten', fecha: '15-Ago-2026' },
    { id: '12', etapa: '9na', mz: '19', villa: '3', ref: 'No desea ser visitado', fecha: '29-Nov-2026' },
    { id: '13', etapa: '9na', mz: '20', villa: '7', ref: 'No desea ser visitado', fecha: '29-Nov-2026' },
    { id: '14', etapa: '9na', mz: '21', villa: '23', ref: 'No desea ser visitado', fecha: '29-Nov-2026' },
    { id: '15', etapa: '9na', mz: '913', villa: '19', ref: 'Edificio departamentos', fecha: '3-Ene-2026' },
    { id: '16', etapa: '5ta', mz: 'IG', villa: '8', ref: 'No desea lo visiten', fecha: '15-Ago-2026' },
    { id: '17', etapa: '11va', mz: '28', villa: '9 y 10', ref: 'Atrás de la hermana Zúñiga', fecha: '16-Abr-2026' },
    { id: '18', etapa: '9na', mz: '948', villa: '4', ref: 'No desea ser visitado', fecha: '07-Jul-2026' },
    { id: '19', etapa: '5ta', mz: 'IE', villa: '1', ref: 'No desea lo visiten', fecha: '15-Ago-2026' },
  ];

  const filteredCasas = casasNoPredicar.filter(c =>
    c.etapa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mz.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.villa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ref.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <NavbarApp />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-nav-safe">

        {/* Search & Filter Bar */}
        {/* <section className="mb-8">
          <div className="relative group max-w-3xl mx-auto">
            <input
              disabled
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar territorio, etapa o manzana..."
              className="w-full bg-white text-on-surface border border-surface-container py-4 pl-12 pr-12 rounded-full shadow-ambient hover:shadow-ambient-hover focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-base placeholder:text-on-surface-variant/60"
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">
              search
            </span>
            <button
              type="button"
              onClick={() => handleGrupos()}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </section> */}

        {/* 4-Card Stats Overview */}
        {/* <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10"> */}
        {/* Active */}
        {/* <div className="bg-white p-5 rounded-3xl shadow-ambient border border-surface-container flex flex-col justify-between hover:shadow-ambient-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Activos
              </span>
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                12
              </span>
              <span className="text-xs text-on-surface-variant">en campo</span>
            </div>
          </div> */}

        {/* Completed */}
        {/* <div className="bg-white p-5 rounded-3xl shadow-ambient border border-surface-container flex flex-col justify-between hover:shadow-ambient-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Completados
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-extrabold text-secondary tracking-tight">
                48
              </span>
              <span className="text-xs text-emerald-600 font-medium">↑ +14%</span>
            </div>
          </div> */}

        {/* Pending */}
        {/* <div className="bg-white p-5 rounded-3xl shadow-ambient border border-surface-container flex flex-col justify-between hover:shadow-ambient-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Pendientes
              </span>
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-extrabold text-tertiary tracking-tight">
                08
              </span>
              <span className="text-xs text-on-surface-variant">por iniciar</span>
            </div>
          </div> */}

        {/* Efficiency */}
        {/* <div className="bg-white p-5 rounded-3xl shadow-ambient border border-surface-container flex flex-col justify-between hover:shadow-ambient-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Eficacia
              </span>
              <span className="w-2 h-2 rounded-full bg-primary-dark"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                94%
              </span>
              <span className="text-xs text-primary font-medium">Meta anual</span>
            </div>
          </div>
        </section> */}

        {/* Bento Active Territories Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-on-surface tracking-tight">
                Territorios Activos
              </h2>
              <p className="text-xs text-on-surface-variant">
                Grupo seleccionado: <strong className="text-primary">{nombreGrupo}</strong>
              </p>
            </div>
            <button
              onClick={handleGrupos}
              className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary-dark transition-colors"
            >
              Ver todos <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Territory Card 1 */}
            {/* <div className="group bg-white rounded-3xl shadow-ambient hover:shadow-ambient-hover overflow-hidden flex flex-col transition-all duration-300 border border-surface-container hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt="Centro Metropolitano" 
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" 
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-mono font-medium backdrop-blur-md shadow-sm">
                    4 días restantes
                  </span>
                  <span className="bg-white/90 text-on-surface px-3 py-1 rounded-full text-xs font-mono font-medium backdrop-blur-md shadow-sm">
                    Zona Oeste
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">
                    Centro Metropolitano A-1
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Aug 24 - Sep 02, 2024
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <AvatarGroup isBordered max={3} size="sm" color="primary">
                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                    <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                    <Avatar name="+5" />
                  </AvatarGroup>
                  <span className="text-xs font-mono text-on-surface-variant">
                    32 manzanas
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-surface-container">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant font-medium">Progreso</span>
                    <span className="text-primary font-bold font-mono">68%</span>
                  </div>
                  <div className="h-2.5 w-full bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: '68%' }}></div>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  color="primary" 
                  variant="flat" 
                  onPress={handleGrupos}
                  className="w-full font-semibold rounded-xl"
                >
                  Abrir Cuadrícula
                </Button>
              </div>
            </div> */}

            {/* Territory Card 2 */}
            {/* <div className="group bg-white rounded-3xl shadow-ambient hover:shadow-ambient-hover overflow-hidden flex flex-col transition-all duration-300 border border-surface-container hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt="Sector Industrial" 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" 
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-secondary/90 text-white px-3 py-1 rounded-full text-xs font-mono font-medium backdrop-blur-md shadow-sm">
                    Prioridad
                  </span>
                  <span className="bg-white/90 text-on-surface px-3 py-1 rounded-full text-xs font-mono font-medium backdrop-blur-md shadow-sm">
                    Sector Este
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">
                    Parque Industrial B-12
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Sep 01 - Sep 15, 2024
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <AvatarGroup isBordered max={3} size="sm" color="secondary">
                    <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026708c" />
                    <Avatar name="+2" />
                  </AvatarGroup>
                  <span className="text-xs font-mono text-on-surface-variant">
                    18 manzanas
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-surface-container">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant font-medium">Progreso</span>
                    <span className="text-secondary font-bold font-mono">24%</span>
                  </div>
                  <div className="h-2.5 w-full bg-secondary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full transition-all duration-700" style={{ width: '24%' }}></div>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  color="secondary" 
                  variant="flat" 
                  onPress={handleGrupos}
                  className="w-full font-semibold rounded-xl"
                >
                  Abrir Cuadrícula
                </Button>
              </div>
            </div> */}

            {/* Territory Card 3 (Hero Gradient Action Box) */}
            <div className="bg-gradient-to-br from-primary-dark via-primary to-purple-800 text-white rounded-3xl shadow-ambient p-6 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <span className="font-mono text-xs font-semibold text-purple-200 uppercase tracking-wider block">
                  Estado de Predicación
                </span>
                <h3 className="text-2xl font-bold mt-2 mb-4 leading-tight">
                  Optimización y Gestión de Grupo
                </h3>

                <div className="space-y-3 mb-6">
                  {/* <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl flex items-center justify-between border border-white/20">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-purple-200">map</span>
                      <span className="text-xs font-medium">Rutas en Cobertura</span>
                    </div>
                    <span className="font-bold font-mono text-sm">1,240</span>
                  </div> */}

                  {/* <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl flex items-center justify-between border border-white/20">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-purple-200">person_pin_circle</span>
                      <span className="text-xs font-medium">Publicadores Asignados</span>
                    </div>
                    <span className="font-bold font-mono text-sm">86%</span>
                  </div> */}
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-2">
                <Button
                  size="lg"
                  color="default"
                  variant="solid"
                  onPress={handleGrupos}
                  className="w-full bg-white text-primary font-bold rounded-full shadow-md active-scale"
                >
                  Ir a Territorios de Predicación
                </Button>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={handleFolio}
                    className="flex-1 bg-white/20 text-white font-medium rounded-full"
                  >
                    📊 Folio S-13-S
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={handlePDF}
                    className="flex-1 bg-white/20 text-white font-medium rounded-full"
                  >
                    📄 Ver PDF
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section: Casas No Predicar / No Visitar */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-on-surface flex items-center gap-2">
                <span>⛔️ Casas No Visitar / No Predicar</span>
              </h2>
              <p className="text-xs text-on-surface-variant">
                Listado actualizado de casas con restricción o solicitud especial
              </p>
            </div>
            <Chip size="sm" color="danger" variant="flat" className="font-mono text-xs">
              {filteredCasas.length} registradas
            </Chip>
          </div>

          <div className="bg-white rounded-3xl shadow-ambient border border-surface-container overflow-hidden">
            <Table
              aria-label="Tabla de Casas No Predicar"
              className="min-w-full"
              shadow="none"
              classNames={{
                th: "bg-surface-container-low text-on-surface font-semibold text-xs py-3",
                td: "py-3 text-xs"
              }}
            >
              <TableHeader>
                <TableColumn>ETAPA</TableColumn>
                <TableColumn>MANZANA</TableColumn>
                <TableColumn>VILLA</TableColumn>
                <TableColumn>REFERENCIA Y MOTIVO</TableColumn>
                {/* <TableColumn>FECHA REGISTRO</TableColumn> */}
              </TableHeader>
              <TableBody emptyContent="No se encontraron casas con el criterio de búsqueda">
                {filteredCasas.map((casa) => (
                  <TableRow key={casa.id} className="hover:bg-surface-container-lowest transition-colors border-b border-surface-container last:border-none">
                    <TableCell className="font-semibold text-primary">{casa.etapa}</TableCell>
                    <TableCell className="font-mono font-bold">{casa.mz}</TableCell>
                    <TableCell className="font-mono">{casa.villa}</TableCell>
                    <TableCell className="text-on-surface-variant font-medium">{casa.ref}</TableCell>
                    {/* <TableCell className="font-mono text-on-surface-variant/80">{casa.fecha}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Recent Activity Timeline & User Schedule Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

          {/* Recent Activity Feed (2 cols) */}
          {/* <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-on-surface mb-4">
              Actividad Reciente
            </h2>
            <div className="bg-white rounded-3xl shadow-ambient border border-surface-container overflow-hidden divide-y divide-surface-container"> */}

          {/* Activity Item 1 */}
          {/* <div className="p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">check_circle</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      Territorio Distrito Harbor Completado
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      Informe final y registro de manzanas archivado por Mark J.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-on-surface-variant whitespace-nowrap pl-2">
                  hace 2h
                </span>
              </div> */}

          {/* Activity Item 2 */}
          {/* <div className="p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">group_add</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      Actualización de Grupo
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      4 nuevos publicadores asignados a la zona del grupo.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-on-surface-variant whitespace-nowrap pl-2">
                  hace 5h
                </span>
              </div> */}

          {/* Activity Item 3 */}
          {/* <div className="p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">warning</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                      Alerta de Vencimiento
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      Territorio Parque Industrial B-12 está próximo a vencer fecha.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-on-surface-variant whitespace-nowrap pl-2">
                  Ayer
                </span>
              </div> */}

          {/*  </div>
          </div> */}

          {/* Assigned Schedule Card (1 col) */}
          {/* <div>
            <h2 className="text-2xl font-bold text-on-surface mb-4">
              Mi Asignación
            </h2>
            <div className="bg-white rounded-3xl shadow-ambient border border-surface-container p-6 flex flex-col justify-between h-[230px]">
              <div>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider">
                    Horario de Salida
                  </span>
                </div>
                <h3 className="text-lg font-bold text-on-surface">
                  {user?.horario && user?.territorio
                    ? `${user.horario} • ${user.territorio}`
                    : 'Predicación Matutina • Grupo Activo'}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Revisa con el conductor de grupo cualquier cambio de punto de encuentro.
                </p>
              </div>

              <Button
                size="sm"
                color="primary"
                variant="bordered"
                onPress={handleGrupos}
                className="w-full font-semibold rounded-xl"
              >
                Ver Mi Territorio
              </Button>
            </div>
          </div> */}

        </section>

      </main>

      <FooterNavbar />
    </>
  );
};

export default Home;
