import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export const PrivateRoutes = () => {

    const {user, loading} = useAuth();

    if(loading) {return <div>Cargando...</div>}
    return user ? <Outlet/> : <Navigate to='/login' />
}