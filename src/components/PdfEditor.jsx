import React, { useEffect, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";

import NavbarApp from './NavbarApp';
import FooterNavbar from './FooterNavbar';
import { useNavigate } from 'react-router-dom';

import { posicionPaginaDos, posicionPaginaUno } from "./utils/_utils";
import DatosGrupoContext, { DatosGrupoProvider, useDatosGrupoContext } from "./contexts/grupoContext";
export const PDFEditor = () => {
    //const pdfRoute = '/S-13-S.pdf'; //Prod route
    const pdfRoute = '/S-13-S.pdf';
    const { nombreGrupo, dataDeGrupo, getDataDeGrupo } = useDatosGrupoContext();
    const [ dataPDF, setDataPDF ] = useState({});

    const [pdfUrl, setPdfUrl] = useState(null);

/*     const getDataDeGrupo = async (nombreDeGrupo) => {
        const docRef = doc(db, 'folioAlboradaEste', nombreDeGrupo);
        const docSnap = await getDoc(docRef);
        if(!docSnap.exists()) {
            console.log('No existe este grupo');
        } else {
            setDataPDF(docSnap.data())
        };
    } */
    
    useEffect(() => {
        if (!nombreGrupo) {
            window.history.go(-1);
        } else {
            getDataDeGrupo(nombreGrupo);
        }
        
        setDataPDF(dataDeGrupo);
        const fetchDataAndGeneratePDF = async () => {
            try {
                const existingPDF = await fetch(pdfRoute).then((res) => res.arrayBuffer());
                const pdfDoc =  await PDFDocument.load(existingPDF);
                const pages = pdfDoc.getPages();
                
                const firstPage = pages[0];
                const secondPage = pages[1];
                console.log(pages, firstPage, secondPage);
                
                let ultimaPagina = await dataPDF.pages.length - 1;
                let penultimaPagina = 0;
                
                /* Titulos de las columnas Pagina 1 y Pagina 2 */
                Object.entries(posicionPaginaUno.columns)
                    .forEach(([key, value]) => 
                        firstPage.drawText(value.name, value.params)
                );

                Object.entries(posicionPaginaDos.columns)
                    .forEach(([key, value]) => 
                        secondPage.drawText(value.name, value.params)
                );

                /* Valores para celdas Pagina 1 */
                let initialY = 700;
                let initialY2 = 685;
                let initialX1 = 60;
                let initialX2 = 110;
                
                /* Valores para celdas Pagina 2 */
                let initialP2Y = 700;
                let initialP2Y2 = 685;
                let initialP2X1 = 25;
                let initialP2X2 = 75;

                //Asignar datos de la penultima y ultima pagina
                let numeroPaginaDeLecturaInicial = dataPDF.pages[ultimaPagina].columns[0].name;
                let dataPenultimaPagina = [];
                let dataUltimaPagina = [];
                console.log(numeroPaginaDeLecturaInicial);
                
                if (numeroPaginaDeLecturaInicial == 6) {
                    penultimaPagina = ultimaPagina - 1;
                    dataPenultimaPagina = dataPDF.pages[penultimaPagina].columns;
                };
                dataUltimaPagina = dataPDF.pages[ultimaPagina].columns;

                console.log(dataPenultimaPagina);
                console.log(dataUltimaPagina);
                

                //Dibujar las filas de cada columna
                Object.entries(dataPenultimaPagina)
                    .forEach(([key, value]) =>{
                        value.rows.forEach((item) => {
                            firstPage.drawText(item.name, {x: initialX1, y: initialY, size: 10});
                            firstPage.drawText(item.startDate, {x: initialX1, y: initialY2, size: 10});
                            initialY-=27.1
                            firstPage.drawText(item.endDate, {x: initialX2, y: initialY2, size: 10});
                            initialY2-=27.1
                        });
                        initialX1 += 110;
                        initialX2 += 110;
                        initialY = 700;
                        initialY2 = 685;
                });

                Object.entries(dataUltimaPagina)
                    .forEach(([key, value]) =>{
                        value.rows.forEach((item) => {
                            secondPage.drawText(item.name, {x: initialP2X1, y: initialP2Y, size: 10});
                            secondPage.drawText(item.startDate, {x: initialP2X1, y: initialP2Y2, size: 10});
                            initialP2Y-=27.1
                            secondPage.drawText(item.endDate, {x: initialP2X2, y: initialP2Y2, size: 10});
                            initialP2Y2-=27.1
                        });
                        initialP2X1 += 110;
                        initialP2X2 += 110;
                        initialP2Y = 700;
                        initialP2Y2 = 685;
                });

                // Guardar PDF modificado
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], {type: 'application/pdf'});
                const pdfUrl = URL.createObjectURL(blob);

                setPdfUrl(pdfUrl);
            } catch (error) {
                console.error('Error al crear PDF', error);
            }
        };

        fetchDataAndGeneratePDF();
    }, [dataPDF])

    return(
        <>
            <NavbarApp />
            <div className="m-4">
                <div>Fromulario S-13-S</div>
                <div>2 páginas de Grupo: {nombreGrupo}</div>
                <div className="m-4">
                    {pdfUrl ? (
                        <a 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
                        href={pdfUrl} 
                        download="{nombreGrupo}.pdf">
                            Descargar PDF
                        </a>
                        /* <iframe key={pdfUrl} src={pdfUrl} width="100%" height="600px" style={{"border": "solid 1px red"}} title="Vista previa"></iframe> */
                    ) : (
                        <p>Cargando...</p>
                    )}
                </div>
            </div>
            <FooterNavbar />
        </>
    )
}