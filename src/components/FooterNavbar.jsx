import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar, NavbarContent, NavbarItem, Button } from "@heroui/react";

const FooterNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <footer className='fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 z-30 shadow-lg'>
      <Navbar maxWidth="full" className="h-14">
        <NavbarContent justify="center" className="gap-2 sm:gap-4 overflow-x-auto py-1">
          <NavbarItem>
            <Button 
              size='sm' 
              variant={location.pathname === '/home' ? 'solid' : 'light'}
              color={location.pathname === '/home' ? 'primary' : 'default'}
              onPress={() => navigate('/home')}
              className="text-xs font-medium"
            >
              🏠 Inicio
            </Button>
          </NavbarItem>
          
          <NavbarItem>
            <Button 
              size='sm' 
              variant={location.pathname === '/grupo' ? 'solid' : 'light'}
              color={location.pathname === '/grupo' ? 'primary' : 'default'}
              onPress={() => navigate('/grupo')}
              className="text-xs font-medium"
            >
              🗺️ Territorios
            </Button>
          </NavbarItem>

          <NavbarItem>
            <Button 
              size='sm' 
              variant={location.pathname === '/foliotable' ? 'solid' : 'light'}
              color={location.pathname === '/foliotable' ? 'primary' : 'default'}
              onPress={() => navigate('/foliotable')}
              className="text-xs font-medium"
            >
              📊 Folio S-13-S
            </Button>
          </NavbarItem>

          <NavbarItem>
            <Button 
              size='sm' 
              variant={location.pathname === '/pdfvisualizer' ? 'solid' : 'light'}
              color={location.pathname === '/pdfvisualizer' ? 'primary' : 'default'}
              onPress={() => navigate('/pdfvisualizer')}
              className="text-xs font-medium"
            >
              📄 Ver PDF
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </footer>
  );
};

export default FooterNavbar;