import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownItem, 
  DropdownTrigger, 
  Dropdown, 
  DropdownMenu,
  Chip,
  Tooltip,
  Avatar
} from "@heroui/react";
import { useAuth } from './AuthProvider';
import { useDatosGrupoContext } from './contexts/grupoContext';
import { roleAtLeast } from './utils/userAccess';

const NavbarApp = () => {
  const { logout, user, profile, role, isTestSession } = useAuth();
  const { isOnline, isSyncing, isTestMode } = useDatosGrupoContext();
  const navigate = useNavigate();

  const isAdmin = roleAtLeast(profile, 'admin');
  const isManager = roleAtLeast(profile, 'manager');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  }; 

  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Usuario';
  const fullName = user?.displayName || 'Usuario';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f7f9fb]/90 backdrop-blur-md border-b border-surface-container px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: User Profile / Greeting */}
        <div className="flex items-center gap-3">
          {user ? (
            <Dropdown placement="bottom-start" className="rounded-2xl shadow-ambient">
              <DropdownTrigger>
                <div className="flex items-center gap-3 cursor-pointer group active-scale">
                  <div className="relative">
                    <Avatar
                      src={user.photoURL || undefined}
                      name={firstName.slice(0, 2).toUpperCase()}
                      size="md"
                      isBordered
                      color="primary"
                      className="transition-transform group-hover:scale-105 border-2 border-primary"
                    />
                    <span 
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} 
                    />
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="text-xs text-on-surface-variant font-medium block leading-tight">
                      Hey,
                    </span>
                    <h1 className="text-base font-bold text-primary dark:text-inverse-primary leading-tight tracking-tight">
                      {fullName}
                    </h1>
                  </div>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Acciones de usuario" className="p-2 min-w-[220px]">
                <DropdownItem 
                  key="user-info" 
                  isReadOnly 
                  className="h-14 gap-2 opacity-100 cursor-default border-b border-surface-container mb-1"
                >
                  <p className="text-xs text-on-surface-variant font-medium">Conectado como</p>
                  <p className="text-xs font-mono font-semibold text-primary truncate">{user.email}</p>
                </DropdownItem>
                <DropdownItem 
                  key="home" 
                  startContent={<span className="material-symbols-outlined text-[20px] text-primary">dashboard</span>}
                  onPress={() => navigate('/home')}
                  className="rounded-xl my-0.5 font-medium"
                >
                  Dashboard Principal
                </DropdownItem>
                {isAdmin && (
                  <DropdownItem
                    key="map"
                    startContent={<span className="material-symbols-outlined text-[20px] text-primary">map</span>}
                    onPress={() => navigate('/grupo')}
                    className="rounded-xl my-0.5 font-medium"
                  >
                    Territorios y Manzanas
                  </DropdownItem>
                )}
                {isAdmin && (
                  <DropdownItem
                    key="folio"
                    startContent={<span className="material-symbols-outlined text-[20px] text-primary">table_chart</span>}
                    onPress={() => navigate('/foliotable')}
                    className="rounded-xl my-0.5 font-medium"
                  >
                    Tabla de Folio (S-13-S)
                  </DropdownItem>
                )}
                {isAdmin && (
                  <DropdownItem
                    key="pdf"
                    startContent={<span className="material-symbols-outlined text-[20px] text-primary">picture_as_pdf</span>}
                    onPress={() => navigate('/pdfvisualizer')}
                    className="rounded-xl my-0.5 font-medium"
                  >
                    Formulario PDF S-13-S
                  </DropdownItem>
                )}
                {isManager && (
                  <DropdownItem
                    key="admin"
                    startContent={<span className="material-symbols-outlined text-[20px] text-primary">admin_panel_settings</span>}
                    onPress={() => navigate('/adminpanel')}
                    className="rounded-xl my-0.5 font-medium"
                  >
                    Panel de Administración
                  </DropdownItem>
                )}
                <DropdownItem
                  key="predicacion"
                  startContent={<span className="material-symbols-outlined text-[20px] text-primary">calendar_month</span>}
                  onPress={() => navigate('/predicacion')}
                  className="rounded-xl my-0.5 font-medium"
                >
                  Arreglo de Predicación
                </DropdownItem>
                {isAdmin && (
                  <DropdownItem
                    key="predicacion-editor"
                    startContent={<span className="material-symbols-outlined text-[20px] text-primary">edit_calendar</span>}
                    onPress={() => navigate('/predicacioneditor')}
                    className="rounded-xl my-0.5 font-medium"
                  >
                    Editar Predicación
                  </DropdownItem>
                )}
                {isAdmin && (
                  <DropdownItem
                    key="casas-no-visitar"
                    startContent={<span className="material-symbols-outlined text-[20px] text-primary">block</span>}
                    onPress={() => navigate('/casasnovisitar')}
                    className="rounded-xl my-0.5 font-medium"
                  >
                    Casas No Visitar
                  </DropdownItem>
                )}
                <DropdownItem
                  key="logout"
                  color="danger" 
                  className="text-danger rounded-xl mt-1 border-t border-surface-container pt-2 font-semibold"
                  startContent={<span className="material-symbols-outlined text-[20px]">logout</span>}
                  onPress={handleLogout}
                >
                  Cerrar Sesión
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">map</span>
              </span>
              <span className="font-bold text-lg text-primary">TerritoriosApp</span>
            </div>
          )}
        </div>

        {/* Right: Status Pills & Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Indicador de Modo Pruebas */}
          {isTestMode && (
            <Tooltip content="Trabajando en colecciones aisladas para pruebas" placement="bottom">
              <Chip
                size="sm"
                variant="flat"
                className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full"
              >
                🧪 Modo Pruebas
              </Chip>
            </Tooltip>
          )}

          {/* Indicador de Sesión de Prueba (login sin Google/Outlook) */}
          {isTestSession && (
            <Tooltip content="Sesión simulada, no es una cuenta real" placement="bottom">
              <Chip
                size="sm"
                variant="flat"
                className="bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-300 font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full"
              >
                🧑‍💻 Rol de prueba: {role}
              </Chip>
            </Tooltip>
          )}

          {/* Indicador de Conectividad */}
          {isSyncing ? (
            <Chip 
              size="sm" 
              variant="flat" 
              className="bg-purple-100 text-primary font-medium text-xs rounded-full animate-pulse"
              startContent={<span className="material-symbols-outlined text-[16px] animate-spin">sync</span>}
            >
              Sincronizando
            </Chip>
          ) : isOnline ? (
            <Tooltip content="Sincronización en tiempo real con Firebase activa" placement="bottom">
              <Chip 
                size="sm" 
                variant="flat" 
                className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-xs rounded-full px-2"
                startContent={<span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1"></span>}
              >
                En línea
              </Chip>
            </Tooltip>
          ) : (
            <Tooltip content="Trabajando en modo offline. Los cambios se guardarán localmente." placement="bottom">
              <Chip 
                size="sm" 
                variant="solid" 
                className="bg-amber-500 text-white font-medium text-xs rounded-full shadow-sm"
                startContent={<span className="material-symbols-outlined text-[14px]">cloud_off</span>}
              >
                Offline
              </Chip>
            </Tooltip>
          )}

          {/* Quick Notifications / Info Bell */}
          <button 
            type="button"
            aria-label="Notificaciones"
            onClick={() => navigate('/home')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-primary border border-surface-container shadow-sm hover:bg-surface-container-low active-scale transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavbarApp;