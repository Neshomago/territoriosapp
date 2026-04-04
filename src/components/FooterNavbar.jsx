import React from 'react'
import { useNavigate } from 'react-router-dom';
import {Navbar, NavbarContent, NavbarItem, Button, Link} from "@heroui/react";

//Configuración para subir colección
import { db } from './firebase';
import { territorios, doc_S13_S_data } from './utils/_utils';
import { doc,collection,writeBatch, getDocs } from 'firebase/firestore';

const FooterNavbar = () => {
  const navigate = useNavigate();

  const handleHome = async () => {
    navigate('/home');
  }; 
  const handleRename = async () => {
    navigate('/grouprenamer');
  }; 
  const handleGrupos = async () => {
    navigate('/grupo');
  }; 
  const handleAdmin = async () => {
    navigate('/adminpanel');
  }; 

  //Método para subir configuración de territorios como colección
  const subirTerritorios = async () => {
    try {
      // Crea una referencia al documento, por ejemplo "territories/global"
      //const territoriesCollectionRef = collection(db, "territories");
      
      //Crea una referencia al documento para los territorios del PDF
      const territoriesCollectionRef = collection(db, "folioAlboradaEste");

      // Guarda el objeto completo
      const batch = writeBatch(db); // Usamos un batch para múltiples escrituras atómicas

      //mapeo de información para subir el objeto completo de territorios.
      /* Object.entries(territorios).forEach(([key, value]) => {
        const territoryDocRef = doc(territoriesCollectionRef, key); 
        batch.set(territoryDocRef, value);
      }); */


      //mapeo de información con la estructura para ser usado para el pdf
      Object.entries(doc_S13_S_data).forEach((key) => {
        console.log('key: ', key[1].name);
        console.log(key[1]);
        const territoryDocRef = doc(territoriesCollectionRef, key[1].name); 
        batch.set(territoryDocRef, key[1]);
      });

      //comitear el cambio hecho a la base de datos firebase tal como en MongoDB
      await batch.commit();

      console.log("Territorios guardados correctamente.");
    } catch (error) {
        console.error("Error al guardar los territorios:", error);
    }
  };

  const handleData = async () => {
    try {
      const territoriesCollectionRef = collection(db, "folioAlboradaEste");
      const docsSnapshot = await getDocs(territoriesCollectionRef)

      docsSnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });

      const documents = docsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(documents);

    } catch (error) {
      console.log('error al traer la data...', error)
    }
  }

  return (
    <footer className='fixed bottom-0 w-full bg-gray-100 border-t z-10'>
    <Navbar>
      <NavbarContent justify="start">
        <NavbarItem>
          <Button onPress={handleHome} size='md'>🏠 Ir a Inicio</Button>
          <Button onPress={handleData} size='md'>Ver toda la data</Button>
          {/* <Button onPress={handleRename} size='md'>Renombrar Territorio</Button> */}
        </NavbarItem>
        {/* <NavbarItem>
          <Button onPress={handleGrupos} size='md'> Grupos Pred. </Button>
        </NavbarItem> */}
        {/* Boton de configuración para subir territorios del archivo _utils.js */}
          {/* <NavbarItem>
            <Link onPress={subirTerritorios} size='lg'>Subir Configuracion Territorios</Link>
          </NavbarItem> */}
       
      </NavbarContent>
{/*       <NavbarContent justify="end">
        <NavbarItem>
          <Button onPress={handleAdmin} size='md'>⚙️ Administrador</Button>
        </NavbarItem>
      </NavbarContent> */}
    </Navbar>
    </footer>
  )
}

export default FooterNavbar