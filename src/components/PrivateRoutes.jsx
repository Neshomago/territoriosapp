import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { roleAtLeast } from './utils/userAccess'

export const PrivateRoutes = ({ minRole = 'user' }) => {

    const { user, loading, isApproved, loadingProfile, profile } = useAuth();

    if (loading || (user && loadingProfile)) { return <div>Cargando...</div> }
    if (!user) { return <Navigate to='/login' /> }
    if (!isApproved) { return <Navigate to='/pending-approval' /> }
    if (!roleAtLeast(profile, minRole)) { return <Navigate to='/home' /> }

    return <Outlet/>
}
