import { getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    OAuthProvider,
    signOut } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';
import { isUserApproved, getUserRole } from './utils/userAccess';

const AuthContext = createContext();

const ensureUserDoc = async (firebaseUser) => {
    const userDocRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          role: 'user',
          status: 'pending',
          createdAt: new Date(),
          territorio: '',
          horario: ''
        });
    }
};

// Solo para desarrollo local: permite "iniciar sesión" como cada nivel de
// rol sin pasar por el popup de Google/Outlook. Nunca se usa en producción
// porque `import.meta.env.DEV` es `false` en el build (Vite elimina el
// código muerto correspondiente).
const TEST_SESSION_KEY = 'territoriosapp_test_role';

const TEST_ROLE_PROFILES = {
    user: { uid: 'test-user', displayName: 'Test Usuario', email: 'test-user@local.test' },
    admin: { uid: 'test-admin', displayName: 'Test Admin', email: 'test-admin@local.test' },
    manager: { uid: 'test-manager', displayName: 'Test Gerente', email: 'test-manager@local.test' },
    superuser: { uid: 'test-superuser', displayName: 'Test Superusuario', email: 'test-superuser@local.test' },
};

const readStoredTestRole = () => {
    if (!import.meta.env.DEV) return null;
    try {
        return sessionStorage.getItem(TEST_SESSION_KEY) || null;
    } catch {
        return null;
    }
};

export const AuthProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [testRole, setTestRole] = useState(readStoredTestRole);
    const auth = getAuth();

    const testUser = testRole ? TEST_ROLE_PROFILES[testRole] : null;
    const user = testUser || authUser;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setAuthUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        if (!user) {
            setProfile(null);
            setLoadingProfile(false);
            return undefined;
        }

        setLoadingProfile(true);

        const userDocRef = doc(db, COLLECTIONS.USERS, user.uid);
        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            // En una carga en frío, el primer snapshot puede venir del
            // cache local sin confirmar con el servidor y reportar
            // "no existe" antes de sincronizar (por ejemplo justo después
            // de restaurar la sesión de Firebase Auth). Si pasa eso, se
            // espera la confirmación real en vez de tratarlo como
            // definitivo, para no mandar a un usuario aprobado a la
            // pantalla de pendiente de aprobación por un falso negativo.
            if (!snapshot.exists() && snapshot.metadata.fromCache) {
                return;
            }

            setProfile(snapshot.exists() ? snapshot.data() : null);
            setLoadingProfile(false);
        });

        return () => unsubscribe();
    }, [user]);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await ensureUserDoc(user);

            setAuthUser(user);
            console.log('Usuario autenticado: ', user.displayName);
        } catch (err) {
            console.log('Error durante el login: ', err);
        }
    };

    const loginWithOutlook = async () => {
        const provider = new OAuthProvider('microsoft.com');

        provider.addScope('openid');
        provider.addScope('profile');
        provider.addScope('email');
        provider.addScope('User.Read');

        provider.setCustomParameters({domain_hint: 'outlook.com'})
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await ensureUserDoc(user);

            setAuthUser(user);
            console.log('Usuario autenticado: ', user.displayName);
        } catch (err) {
            console.log('Error durante el login: ', err);
        }
    };

    // Crea/actualiza un perfil real en Firestore (misma colección, mismo
    // esquema `role`/`status` que un usuario real) para el rol elegido, y
    // lo activa como la sesión actual. Solo tiene efecto en desarrollo.
    const loginAsTestUser = async (testRoleKey) => {
        if (!import.meta.env.DEV) return;

        const testProfile = TEST_ROLE_PROFILES[testRoleKey];
        if (!testProfile) return;

        const userDocRef = doc(db, COLLECTIONS.USERS, testProfile.uid);
        await setDoc(userDocRef, {
            name: testProfile.displayName,
            email: testProfile.email,
            role: testRoleKey,
            status: 'approved',
            createdAt: new Date(),
            territorio: '',
            horario: ''
        }, { merge: true });

        try {
            sessionStorage.setItem(TEST_SESSION_KEY, testRoleKey);
        } catch (err) {
            console.log('No se pudo guardar la sesión de prueba: ', err);
        }

        setTestRole(testRoleKey);
    };

    const logout = async () => {
        try {
            if (testRole) {
                try {
                    sessionStorage.removeItem(TEST_SESSION_KEY);
                } catch (err) {
                    console.log('No se pudo limpiar la sesión de prueba: ', err);
                }
                setTestRole(null);
            }

            if (authUser) {
                await signOut(auth);
                setAuthUser(null);
            }

            console.log('Sesión cerrada.');
        } catch (err) {
            console.log('Error al cerrar sesión: ', err);
        }
    }

    const isApproved = isUserApproved(profile);
    const role = getUserRole(profile);
    const isTestSession = Boolean(testRole);

  return (
    <AuthContext.Provider
        value={{
            user, loading, loginWithGoogle, loginWithOutlook, loginAsTestUser, logout,
            profile, loadingProfile, isApproved, role, isTestSession,
        }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
