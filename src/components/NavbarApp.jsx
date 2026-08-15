import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Navbar, 
  NavbarContent, 
  NavbarItem, 
  User, 
  Button, 
  DropdownItem, 
  DropdownTrigger, 
  Dropdown, 
  DropdownMenu,
  Chip,
  Tooltip 
} from "@heroui/react";
import { useAuth } from './AuthProvider';
import { useDatosGrupoContext } from './contexts/grupoContext';

const NavbarApp = () => {
  const { logout, user } = useAuth();
  const { isOnline, isSyncing, isTestMode } = useDatosGrupoContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  }; 

  return (
    <>
      <Navbar className='shadow-md bg-white' maxWidth="full">
        {/* Usuario y Menú */}
        <NavbarContent justify="start">
          {user ? (
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    src: user.photoURL || undefined,
                    name: user.displayName ? user.displayName.slice(0, 2) : 'US',
                    isBordered: true,
                    color: isOnline ? "success" : "warning"
                  }}
                  className='transition-transform text-left cursor-pointer'
                  description={user.email}
                  name={user.displayName || 'Usuario'}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Acciones de usuario">
                <DropdownItem key="map" onPress={() => navigate('/grupo')}>
                  🗺️ Territorios y Manzanas
                </DropdownItem>
                <DropdownItem key="folio" onPress={() => navigate('/foliotable')}>
                  📊 Tabla de Folio (S-13-S)
                </DropdownItem>
                <DropdownItem key="pdf" onPress={() => navigate('/pdfvisualizer')}>
                  📄 Formulario PDF S-13-S
                </DropdownItem>
                <DropdownItem key="home" onPress={() => navigate('/home')}>
                  🏠 Ir al Inicio
                </DropdownItem>
                <DropdownItem key="logout" color="danger" className="text-danger" onPress={handleLogout}>
                  🚪 Cerrar Sesión
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <span className="font-bold text-gray-700">TerritoriosApp</span>
          )}
        </NavbarContent>

        {/* Indicadores de Estado: Conectividad y Modo Pruebas */}
        <NavbarContent justify="end" className="gap-2">
          {/* Indicador de Modo Pruebas */}
          {isTestMode && (
            <NavbarItem>
              <Tooltip content="Trabajando en colecciones aisladas (territories_test y folio_records_test) para no alterar datos de producción">
                <Chip size="sm" color="warning" variant="flat" className="font-mono text-[11px]">
                  🧪 Modo Pruebas
                </Chip>
              </Tooltip>
            </NavbarItem>
          )}

          {/* Indicador de Conectividad Offline / Online */}
          <NavbarItem>
            {isSyncing ? (
              <Chip size="sm" color="primary" variant="flat" className="text-xs">
                🔄 Sincronizando...
              </Chip>
            ) : isOnline ? (
              <Chip size="sm" color="success" variant="dot" className="text-xs">
                En línea
              </Chip>
            ) : (
              <Chip size="sm" color="warning" variant="solid" className="text-xs text-white">
                🟡 Sin conexión (Offline)
              </Chip>
            )}
          </NavbarItem>

          {user && (
            <NavbarItem>
              <Button size="sm" variant="light" color="danger" onPress={handleLogout}>
                Salir
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default NavbarApp;