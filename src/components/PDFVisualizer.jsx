import React, { useEffect, useState } from "react";
import NavbarApp from './NavbarApp';
import FooterNavbar from './FooterNavbar';

import { PDFDocument } from "pdf-lib";
import { territorios, posicionPaginaDos, posicionPaginaUno } from "./utils/_utils";
import { useDatosGrupoContext } from "./contexts/grupoContext";
import { Select, SelectItem } from "@heroui/react";
import PDFCanvasViewer from "./PDFCanvasViewer";
import { data } from "autoprefixer";

export const PDFVisualizer = () => {
    const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const pdfRoute = "/S-13_S.pdf";
    const { setNombreGrupo, nombreGrupo, getDataDeGrupo, dataDeGrupo } = useDatosGrupoContext();
    
    const [territoriosState] = useState(territorios);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    //revisa que año teocrático es
    const now = new Date();
    const year = now.getFullYear();
    const adjustedYear = now.getMonth() >= 8 ? year + 1 : year;

    // Función para extraer todas las asignaciones (rows) de todas las columnas de Firebase
    const getAllAssignmentsFromFirebase = (pages) => {
        const allAssignments = [];

        console.log('pages: ', pages);
        
        // Recorrer todas las páginas y columnas de Firebase
        pages.forEach(page => {
            console.log('page: ', page);
            
            page.columns.forEach(column => {
                // Agregar cada row con información del territorio
                if (column.rows && column.rows.length > 0) {
                    column.rows.forEach(row => {
                        console.log('fila:',row);
                        
                        allAssignments.push({
                            territoryNumber: column.name,
                            name: row.name,
                            startDate: row.startDate,
                            endDate: row.endDate,
                            firebasePage: page.page,
                            completed: column.completed
                        });
                    });
                }
            });
        });

        console.log('AllAssignments: ', allAssignments);
        
        return allAssignments;
    };

    // Función para agrupar asignaciones en columnas del PDF (4 columnas por página)
    const groupAssignmentsByPDFColumns = (assignments) => {
        console.log('assigments per group: ', assignments);
        
        const pdfPages = [];
        const columnsPerPage = 4;
        const assignmentsPerColumn = Math.ceil(assignments.length / columnsPerPage);

        // Si no hay suficientes asignaciones para llenar una página completa
        if (assignments.length <= columnsPerPage) {
            // Crear una sola fila con todas las asignaciones
            pdfPages.push([assignments]);
            console.log('pdfPages:', pdfPages);
            
            return pdfPages;
        }
        

        // Dividir asignaciones en grupos para cada página del PDF
        for (let pageIndex = 0; pageIndex < Math.ceil(assignments.length / (columnsPerPage * assignmentsPerColumn)); pageIndex++) {
            const pageAssignments = [];
            
            // Crear 4 columnas por página
            for (let colIndex = 0; colIndex < columnsPerPage; colIndex++) {
                const columnAssignments = [];
                const startIndex = (pageIndex * columnsPerPage * assignmentsPerColumn) + (colIndex * assignmentsPerColumn);
                const endIndex = Math.min(startIndex + assignmentsPerColumn, assignments.length);
                
                for (let i = startIndex; i < endIndex; i++) {
                    if (assignments[i]) {
                        columnAssignments.push(assignments[i]);
                    }
                }
                console.log('columnAssignments: ', columnAssignments);
                
                if (columnAssignments.length > 0) {
                    pageAssignments.push(columnAssignments);
                }
            }
            
            if (pageAssignments.length > 0) {
                pdfPages.push(pageAssignments);
            }
            console.log('forloop pageIndex pdfPages:', pdfPages);
        }

        return pdfPages;
    };

    // Función para verificar si necesitamos crear una nueva página en Firebase
    const shouldCreateNewFirebasePage = (dataDeGrupo) => {
        if (!dataDeGrupo.pages || dataDeGrupo.pages.length === 0) return false;
        
        const lastPage = dataDeGrupo.pages[dataDeGrupo.pages.length - 1];
        const completedColumns = lastPage.columns.filter(col => col.completed).length;
        
        // Si la última página tiene 4 columnas completas, necesita nueva página
        return completedColumns >= 4;
    };

    useEffect(() => {
        if (nombreGrupo) {
            getDataDeGrupo(nombreGrupo);
        }
    }, [nombreGrupo]);
    
    useEffect(() => {
        if (!nombreGrupo || !dataDeGrupo || !dataDeGrupo.pages) return;

        const fetchDataAndGeneratePDF = async () => {
            setLoading(true);

            // Limpia la URL previa
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
                setPdfUrl(null);
            }

            try {
                // Obtener data desde Firebase
                /* const dataPDF = await getDataDeGrupo(nombreGrupo);
                if (!dataPDF || !dataPDF.pages) {
                    console.error("Data del grupo inválida");
                    return;
                } */

                const existingPDF = await fetch(pdfRoute).then((res) =>
                    res.arrayBuffer()
                );

                const pdfDoc = await PDFDocument.load(existingPDF);
                const pages = pdfDoc.getPages();
                const firstPage = pages[0];
                const secondPage = pages[1];

                /**
                 * Sección de Codigo sugerido por Claude.ai
                 * Para dibujar en PDF lo que se tiene
                 */

                // Obtener todas las asignaciones de Firebase
                const allAssignments = getAllAssignmentsFromFirebase(dataDeGrupo.pages);
                console.log('Data de grupo:', dataDeGrupo);
                console.log('Total asignaciones:', allAssignments.length);

                // Agrupar asignaciones en columnas del PDF (4 columnas por página)
                const pdfPageGroups = groupAssignmentsByPDFColumns(allAssignments);
                console.log('Grupos de páginas PDF:', pdfPageGroups.length);

                // Verificar si necesitamos crear nueva página en Firebase
                const needsNewFirebasePage = shouldCreateNewFirebasePage(dataDeGrupo);
                console.log('¿Necesita nueva página en Firebase?', needsNewFirebasePage);

                // Dibujar año teocrático en ambas páginas
                firstPage.drawText(`${adjustedYear}`, {x: 140, y: 750, size: 12});
                if (secondPage) {
                    secondPage.drawText(`${adjustedYear}`, {x: 140, y: 750, size: 12});
                }

                // Función mejorada para dibujar datos de asignaciones
                const drawAssignmentsOnPage = (page, assignmentColumns, posicionConfig) => {
                    // Dibujar encabezados de columnas
                    Object.entries(posicionConfig.columns)
                        .slice(0, assignmentColumns.length)
                        .forEach(([_, value], index) => {
                            if (assignmentColumns[index] && assignmentColumns[index].length > 0) {
                                // Usar el primer territorio de la columna como encabezado
                                const firstAssignment = assignmentColumns[index][0];
                                page.drawText(firstAssignment.territoryNumber, value.params);
                            }
                        });

                    // Dibujar datos de las asignaciones
                    let initialX1 = 140;
                    let initialX2 = 190;
                    let initialY = 685;
                    let initialY2 = 670;

                    // Encontrar el máximo número de asignaciones entre todas las columnas
                    const maxAssignments = Math.max(...assignmentColumns.map(col => col.length));

                    // Dibujar asignación por asignación
                    for (let assignmentIndex = 0; assignmentIndex < maxAssignments; assignmentIndex++) {
                        initialX1 = 140;
                        initialX2 = 190;

                        assignmentColumns.forEach((columnAssignments, colIndex) => {
                            if (columnAssignments[assignmentIndex]) {
                                const assignment = columnAssignments[assignmentIndex];
                                
                                // Dibujar nombre
                                page.drawText(assignment.name || '', { 
                                    x: initialX1, 
                                    y: initialY, 
                                    size: 10 
                                });
                                // Dibujar fecha de inicio
                                page.drawText(assignment.startDate || '', { 
                                    x: initialX1, 
                                    y: initialY2, 
                                    size: 9 
                                });
                                // Dibujar fecha de fin
                                page.drawText(assignment.endDate || '', { 
                                    x: initialX2, 
                                    y: initialY2, 
                                    size: 9 
                                });
                            }
                            initialX1 += 106;
                            initialX2 += 106;
                        });

                        initialY -= 31;
                        initialY2 -= 31;
                    }
                };

                // Dibujar primera página del PDF (primeras 4 columnas de asignaciones)
                if (pdfPageGroups[0]) {
                    drawAssignmentsOnPage(firstPage, pdfPageGroups[0], posicionPaginaUno);
                }

                // Dibujar segunda página del PDF (siguientes 4 columnas de asignaciones) si existe
                if (pdfPageGroups[1] && secondPage) {
                    drawAssignmentsOnPage(secondPage, pdfPageGroups[1], posicionPaginaDos);
                }

                /*------------ Sección de Codigo Anterior ------------*/
                /*------------ Dibujar filas ------------*/
                /*
                //Total de paginas del grupo
                let totalPaginas = dataDeGrupo.pages.length;
                
                let ultimaPagina = totalPaginas - 1;
                let penultimaPagina = totalPaginas - 2;

                //Datos de cada pagina respectivamente
                let dataUltimaPagina = dataDeGrupo.pages[ultimaPagina].columns;
                let dataPenultimaPagina = dataDeGrupo.pages[penultimaPagina].columns;
                
                let dataTerritorios = [...dataPenultimaPagina, ...dataUltimaPagina];
                console.log(dataTerritorios.length);
                
                // Dibujar encabezados
                firstPage.drawText(`${adjustedYear}`, {x: 140, y:750, size: 12})
                Object.entries(posicionPaginaUno.columns)
                .slice(0, dataTerritorios.length)
                .forEach(([_, value]) =>
                    firstPage.drawText(value.name, value.params)
                );
                Object.entries(posicionPaginaDos.columns).forEach(([_, value]) =>
                    secondPage.drawText(value.name, value.params)
                );
                
                if (dataDeGrupo[0]?.name == 6) {
                    penultimaPagina = ultimaPagina - 1;
                    dataPenultimaPagina = dataDeGrupo.pages[penultimaPagina].columns;
                }

                let drawData = (page, data, initialX1, initialX2, initialY, initialY2) => {
                    Object.entries(data).forEach(([_, value]) => {
                      value.rows.forEach((item) => {
                        page.drawText(item.name, { x: initialX1, y: initialY, size: 10 });
                        page.drawText(item.startDate, { x: initialX1, y: initialY2, size: 9 });
                        initialX1 += 106;
                        page.drawText(item.endDate, { x: initialX2, y: initialY2, size: 9 });
                        initialX2 += 106;
                      });
                      initialX1 = 140;
                      initialX2 = 190;
                      initialY -= 31;
                      initialY2 -= 31;
                    });
                };

                drawData(firstPage, dataTerritorios, 140, 190, 685, 670);
                drawData(secondPage, dataUltimaPagina, 140, 190, 700, 685);
                */

                /*----------- FIN DE BLOQUE INICIAL DE DIBUJADO DE INFO PDF ----------------*/
                
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
                
            } catch (error) {
                console.error("Error generando PDF:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDataAndGeneratePDF();
    }, [dataDeGrupo, nombreGrupo]);

    return (
        <>
            <NavbarApp />
            <div className="p-4">
                <h1 className="text-xl font-bold mb-2">Previsualizador PDF</h1>
                <div className='flex w-full gap-2 items-center'>
                    <Select variant='bordered' label="Territorio" onChange={(e) => setNombreGrupo(e.target.value)}>
                        {Object.keys(territoriosState).map(
                            (territorio) => <SelectItem key={territorio} value={territorio}>{territorio}</SelectItem>
                        )}
                    </Select>
                </div>
                {loading ? (
                    <p>Cargando PDF...</p>
                ) : pdfUrl ? (
                    <>
                        {esMovil ? (
                            <PDFCanvasViewer pdfUrl={pdfUrl}/>
                        ) : (
                            <iframe
                                key={nombreGrupo}
                                src={pdfUrl}
                                width="100%"
                                height="600px"
                                style={{ border: "1px solid #ccc" }}
                                title="Vista previa del PDF"
                            />
                        )}
                        <a
                            href={pdfUrl}
                            target="_blank"
                            download={`${nombreGrupo}.pdf`}
                            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Descargar PDF
                        </a>
                    </>
                ) : (
                    <p>No se pudo generar el PDF.</p>
                )}
            </div>
            <FooterNavbar />
        </>
    );
}