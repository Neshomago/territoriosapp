import { getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    OAuthProvider,
    signOut } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            /* if (currentUser) {
                const timeout = setTimeout(async () => {
                    try {
                        logout();
                        console.log('sesion cerrada automáticamente.');
                    } catch (error) {
                        console.log('error al cerra automáticamente.', error);
                    }
                }, 3 * 60 * 1000);
                return () => clearTimeout(timeout);
            } */
        });
        return () => unsubscribe();
    }, [auth]);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userDocRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userDocRef);

            console.log('userSnapshot: ', userSnapshot);
            
            if (!userSnapshot.exists()) {
                // Si el usuario no existe, lo creamos
                await setDoc(userDocRef, {
                  name: user.displayName,
                  email: user.email,
                  roles: ["user","admin"], // Rol inicial
                  createdAt: new Date(),
                  territorio: '',
                  horario: ''
                });
            }

            // Cargar territorios del usuario
            await loadTerritories(user.uid);

            setUser(user);
            const userObject = `${user.displayName[0]}. ${user.displayName.split(' ')[1]}`
            sessionStorage.setItem('user', user);
            console.log('Usuario autenticado: ', userObject);
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
            
            const userDocRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userDocRef);

            console.log('userSnapshot: ', userSnapshot);
            
            if (!userSnapshot.exists()) {
                // Si el usuario no existe, lo creamos
                await setDoc(userDocRef, {
                  name: user.displayName,
                  email: user.email,
                  roles: ["user","admin"], // Rol inicial
                  createdAt: new Date(),
                  territorio: '',
                  horario: ''
                });
            }

            // Cargar territorios del usuario
            await loadTerritories(user.uid);

            setUser(user);
            const userObject = `${user.displayName[0]}. ${user.displayName.split(' ')[1]}`
            sessionStorage.setItem('user', user);
            console.log('Usuario autenticado: ', userObject);
        } catch (err) {
            console.log('Error durante el login: ', err);
        }
    };

    // Cargar territorios asociados al usuario
    const loadTerritories = async (userId) => {
        try {
            const territoryDocRef = doc(db, "territories", userId);
            const territorySnapshot = await getDoc(territoryDocRef);

            if (territorySnapshot.exists()) {
                setTerritories(territorySnapshot.data());
                console.log("Territorios cargados: ", territorySnapshot.data());
            } else {
                console.log("No hay territorios asociados a este usuario.");
            }
        } catch (error) {
            console.error("Error al cargar territorios: ", error);
        }
    };

    // Actualizar territorios
    const updateTerritories = async (territoryId, updatedData) => {
        try {
            const territoryDocRef = doc(db, "territories", user.uid);
            await updateDoc(territoryDocRef, {
                [territoryId]: updatedData,
            });
            console.log("Territorios actualizados correctamente.");
            // Recargar territorios después de la actualización
            await loadTerritories(user.uid);
        } catch (error) {
            console.error("Error al actualizar territorios: ", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            console.log('Sesión cerrada.');
        } catch (err) {
            console.log('Error al cerrar sesión: ', err);
        }
    }

  return (
    <AuthContext.Provider
        value={{user, loading, loginWithGoogle, loginWithOutlook, logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
