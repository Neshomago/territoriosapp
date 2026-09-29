import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/react';
import { useAuth } from './AuthProvider';

export const PendingApproval = () => {
  const { profile, isApproved, loadingProfile, logout } = useAuth();
  const navigate = useNavigate();

  const isRejected = profile?.status === 'rejected';

  // Si por una carga en frío se llega aquí con un perfil que en realidad
  // ya está aprobado (o se aprueba mientras la pantalla está abierta), se
  // sale automáticamente en vez de dejar a la persona atascada.
  useEffect(() => {
    if (!loadingProfile && isApproved) {
      navigate('/home', { replace: true });
    }
  }, [isApproved, loadingProfile, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen text-center px-4'>
      <span className='material-symbols-outlined text-5xl text-primary mb-4'>
        {isRejected ? 'block' : 'hourglass_top'}
      </span>

      <h1 className='text-2xl font-bold text-gray-900 mb-2'>
        {isRejected ? 'Solicitud rechazada' : 'Cuenta pendiente de aprobación'}
      </h1>

      <p className='text-sm text-gray-500 max-w-sm mb-6'>
        {isRejected
          ? 'Un administrador rechazó el acceso de esta cuenta a la aplicación. Si crees que es un error, contacta a un administrador.'
          : 'Tu cuenta ya fue creada, pero un administrador todavía debe aprobar tu acceso antes de que puedas usar la aplicación.'}
      </p>

      <Button color='primary' variant='flat' onPress={handleLogout}>
        Cerrar sesión
      </Button>
    </div>
  );
};
