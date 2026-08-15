import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FooterNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'home',
      label: 'Inicio',
      icon: 'dashboard',
      path: '/home',
      isActive: location.pathname === '/' || location.pathname === '/home',
    },
    {
      id: 'grupo',
      label: 'Territorios',
      icon: 'map',
      path: '/grupo',
      isActive: location.pathname === '/grupo',
    },
    {
      id: 'folio',
      label: 'Folio S-13-S',
      icon: 'table_chart',
      path: '/foliotable',
      isActive: location.pathname === '/foliotable',
    },
    {
      id: 'pdf',
      label: 'PDF',
      icon: 'picture_as_pdf',
      path: '/pdfvisualizer',
      isActive: location.pathname === '/pdfvisualizer',
    },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Navegación principal"
        className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-surface-container shadow-[0_10px_35px_-5px_rgba(0,0,0,0.12),0_0_1px_1px_rgba(0,0,0,0.05)] rounded-full p-1.5 flex items-center gap-1 sm:gap-2 transition-all duration-300"
      >
        {navItems.map((item) => {
          const active = item.isActive;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 active-scale ${active
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${active ? 'text-white' : 'text-on-surface-variant'}`}>
                {item.icon}
              </span>
              <span className={`text-xs ${active ? 'inline font-semibold' : 'hidden sm:inline font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default FooterNavbar;