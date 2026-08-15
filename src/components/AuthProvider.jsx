import { getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    OAuthProvider,
    signOut } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
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
            
            if (!userSnapshot.exists()) {
                await setDoc(userDocRef, {
                  name: user.displayName,
                  email: user.email,
                  roles: ["user","admin"],
                  createdAt: new Date(),
                  territorio: '',
                  horario: ''
                });
            }

            setUser(user);
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
            
            const userDocRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userDocRef);
            
            if (!userSnapshot.exists()) {
                await setDoc(userDocRef, {
                  name: user.displayName,
                  email: user.email,
                  roles: ["user","admin"],
                  createdAt: new Date(),
                  territorio: '',
                  horario: ''
                });
            }

            setUser(user);
            console.log('Usuario autenticado: ', user.displayName);
        } catch (err) {
            console.log('Error durante el login: ', err);
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
