import { doc,  getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

//Obtener información del usuario
export const getUserData = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDocRef);
    return userSnapshot.exists() ? userSnapshot.data() : null;
};

//actualiza la información o roles
export const updateUserData = async (uid, data) => {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, data);
}