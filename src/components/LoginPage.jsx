import { Button } from '@heroui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

//style={{backgroundImage:`url("https://cms-imgp.jw-cdn.org/img/p/502016230/univ/art/502016230_univ_lsr_xl.jpg")`}}
const LoginPage = () => {
    const { loginWithGoogle, loginWithOutlook } = useAuth();
     const navigate = useNavigate();

    const handleLogin = async () => {
        await loginWithGoogle();
        navigate('/home');
    };
    
    const handleMsLogin = async () => {
        await loginWithOutlook();
        navigate('/home');
    };

  return (
    <div className='flex flex-col h-screen bg-gradient-to-b from-cyan-100 bg-center bg-cover'
        >
        <div className='flex flex-grow items-center justify-center'>
            <div className='text-5xl text-left'>
            <span className='font-sans font-light'>
                Territorio
                <br/>Alborada
                <br/>Este
            </span>
            </div>
        </div>
        <div className='flex flex-col items-end gap-2 mb-4 p-4'>
            <Button className='w-full' color='primary' onPress={handleLogin}>
                <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab"
                data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 
                256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 
                86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 
                3.9 41.4z"></path>
                </svg>
                Login con Google
            </Button>
            <Button className='w-full' color='primary' onPress={handleMsLogin}>
            <img className="mr-2 ml-1 w-5 h-5" src="https://img.icons8.com/ios-filled/50/ms-outlook.png" alt="ms-outlook"/>
                Login con Hotmail / Outlook
            </Button>
            <div className=''>
                <Button className='w-30 scale-85' color='primary' variant='flat' >
                    <span className="material-symbols-outlined"> mail </span>
                    Login con email
                </Button>
                <Button className='w-30 scale-85 text-slate-400' variant='ghost'>
                    <span className="material-symbols-outlined"> person_add </span>
                    Nuevo Usuario
                </Button>
            </div>
        </div>
    </div>
  )
}

export default LoginPage