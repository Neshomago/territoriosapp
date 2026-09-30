import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { roleAtLeast } from './utils/userAccess'
import { useRememberRoute, getRememberedRoute } from './utils/useRememberRoute'

export const PrivateRoutes = ({ minRole = 'user' }) => {

    const { user, loading, isApproved, loadingProfile, profile } = useAuth();
    const location = useLocation();

    useRememberRoute();

    if (loading || (user && loadingProfile)) { return <div>Cargando...</div> }
    if (!user) { return <Navigate to='/login' /> }
    if (!isApproved) { return <Navigate to='/pending-approval' /> }
    if (!roleAtLeast(profile, minRole)) { return <Navigate to='/home' /> }

    if (location.pathname === '/') {
        const lastRoute = getRememberedRoute();
        if (lastRoute && lastRoute !== '/') {
            return <Navigate to={lastRoute} replace />
        }
    }

    return <Outlet/>
}
