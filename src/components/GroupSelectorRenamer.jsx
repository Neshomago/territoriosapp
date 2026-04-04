import { Button, Card, CardBody, CardHeader } from '@heroui/react'
import { Spinner, Input } from '@heroui/react'
import { Select, SelectItem } from "@heroui/react";
import { territorios } from './utils/_utils';

import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; // Importa la configuración de Firebase
import NavbarApp from './NavbarApp';
import FooterNavbar from './FooterNavbar';
import { useNavigate } from 'react-router-dom';

export const GroupSelectorRenamer = () => {
  const [territoriosState, setTerritorios] = useState(territorios);
  const [grupo, setGrupo] = useState(null);
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newId, setNewId] = useState('');
  const [selectedOldId, setSelectedOldId] = useState(null);
  const navigateTo = useNavigate();

/*   const fetchSelectedTerritory = async (territorio) => {
    const docRef = doc(db, 'territories', territorio);
    const docSnap = await getDoc(docRef);
    
    //const docSnap = mockGetDoc(docRef);

    if (docSnap.exists()) {
      setSelectedTerritory(docSnap.data());
    } else {
      console.log("No se encontró el territorio en Firebase");
    }
  }; */

  //Metodo mock para data de prueba
  /* const mockGetDoc = (territorio) => {
      console.log('mockGetDoc: ' ,territorio);
      
      return {
      exists: () => true,
      data: () => territorios,
      };
  }; */

/*   const actualizarFirebase = async (territorioKey) => {
    try {
      const docRef = doc(db, 'territories', territorioKey.name);
      const updatedData = selectedTerritory;
      await updateDoc(docRef, updatedData);
      console.log("Datos actualizados en Firebase.", updatedData);
    } catch (error) {
      console.error("Error al actualizar en Firebase: ", error);
    }
  }; */
  const handleNewIdChange = (value) => {
    setNewId(value);
  };

  const changeDocumentId = async (oldId, newId) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'territories', oldId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        const newDocRef = doc(db, 'territories', newId);
        await setDoc(newDocRef, data);
        console.log(`Datos del documento con ID '${oldId}' copiados a '${newId}'`);

        await deleteDoc(docRef);
        setLoading(false);
        console.log(`Documento con ID '${oldId}' borrado`);
        alert(`ID del territorio cambio exitosamente de '${oldId}' a '${newId}'.`);
        setNewId(''); // Limpiar el input del nuevo ID
        setSelectedOldId(null); // Resetear la selección del ID antiguo
      }
    } catch (error) {
      console.error('Error al cambiar el ID: ', error);
      
    }
  }

  return (
    <>
      <NavbarApp />
      {loading && (<Spinner color='secondary' label='Cargando información...' size='lg'/>)}
      <div className='p-4'>
        <Card>
          <CardBody>
            Seleccione el grupo a renombrar: 
            <div className='flex w-full gap-2 items-center'>
              <Select variant='bordered' label="Territorio" onChange={(e) => setSelectedOldId(e.target.value)}>
                {Object.keys(territoriosState).map(
                  (territorio) => <SelectItem key={territorio} value={territorio}>{territorio}</SelectItem>
                )}
              </Select>
            </div>
          </CardBody>
        </Card>
        
          <Card className='mt-4'>
            <CardHeader className='text-xl'>
              <Input
              label="Nuevo ID del documento"
              onChange={(e) => handleNewIdChange(e.target.value)}/>

              <Button className='w-50 ml-4'
                      color="success"
                      onPress={(e) => changeDocumentId(selectedOldId,newId)}>
                      Renombrar
              </Button>
            </CardHeader>
          </Card>
        
      </div>
      <FooterNavbar />
    </>
  );
}

