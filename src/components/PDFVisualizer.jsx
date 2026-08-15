import React, { useEffect, useState } from "react";
import NavbarApp from './NavbarApp';
import FooterNavbar from './FooterNavbar';

import { PDFDocument } from "pdf-lib";
import { territorios, posicionPaginaDos, posicionPaginaUno } from "./utils/_utils";
import { useDatosGrupoContext } from "./contexts/grupoContext";
import { Select, SelectItem } from "@heroui/react";
import PDFCanvasViewer from "./PDFCanvasViewer";


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

    // Constantes de layout del formulario S-13-S
    // Ajusta estos valores si el texto no cae dentro de las celdas del PDF
    const ROWS_PER_PDF_PAGE = 20;       // Filas de territorio por página
    const ASSIGNMENTS_PER_ROW = 4;     // Máximo 4 columnas "Asignado a" por fila
    const ROW_HEIGHT = 31;              // Altura de cada fila de territorio (px)
    const SUB_ROW_OFFSET = 14;         // Distancia entre sub-fila nombre y sub-fila fechas

    // Posición X de cada sección del formulario
    const COL_TERRITORY_X = 28;        // Col 1: Núm. de terr.
    const COL_LAST_DATE_X = 62;       // Col 2: Última fecha en que se completó
    // Las 4 columnas "Asignado a": nameX = inicio del nombre, dateX = inicio de fechaFin
    const ASSIGNMENT_COLS = [
        { nameX: 139, startDateX: 139, endDateX: 184 },   // Asignado a #1
        { nameX: 245, startDateX: 245, endDateX: 290 },   // Asignado a #2
        { nameX: 351, startDateX: 351, endDateX: 396 },   // Asignado a #3
        { nameX: 457, startDateX: 457, endDateX: 502 },   // Asignado a #4
    ];

    const NAME_SIZE = 7;
    const DATE_SIZE = 6;
    const TERR_NUM_SIZE = 8;
    const FIRST_ROW_Y = 685;   // Y de la primera fila de datos en la página

    /**
     * Extrae todos los territorios de Firebase como una lista ordenada.
     * Cada "column" de Firebase = una fila de territorio en el PDF.
     */
    const getAllTerritoriesFromFirebase = (pages) => {
        const territories = [];

        const sortedPages = [...pages].sort((a, b) => a.page - b.page);

        sortedPages.forEach(page => {
            const sortedColumns = [...page.columns].sort(
                (a, b) => parseInt(a.name) - parseInt(b.name)
            );
            sortedColumns.forEach(column => {
                const lastRow = column.rows && column.rows.length > 0
                    ? column.rows[column.rows.length - 1]
                    : null;
                territories.push({
                    territoryNumber: column.name,
                    lastCompletedDate: lastRow ? lastRow.endDate : '',
                    assignments: column.rows || [],
                    completed: column.completed
                });
            });
        });

        console.log('Territorios extraídos de Firebase:', territories.length);
        return territories;
    };

    /**
     * Dibuja todos los territorios en una página del PDF.
     * Cada territorio = una fila; sus asignaciones llenan las 4 columnas horizontales.
     */
    const drawTerritoriesOnPage = (page, territoriesForPage) => {
        let currentY = FIRST_ROW_Y;

        territoriesForPage.forEach(territory => {
            // Col 1: número de territorio
            page.drawText(String(territory.territoryNumber), {
                x: COL_TERRITORY_X,
                y: currentY,
                size: TERR_NUM_SIZE
            });

            // Col 2: última fecha completada (último endDate de todos los rows)
            if (territory.lastCompletedDate) {
                page.drawText(String(territory.lastCompletedDate), {
                    x: COL_LAST_DATE_X,
                    y: currentY,
                    size: DATE_SIZE
                });
            }

            // Cols 3–6: hasta 4 asignaciones en horizontal
            territory.assignments.slice(0, ASSIGNMENTS_PER_ROW).forEach((assignment, i) => {
                const col = ASSIGNMENT_COLS[i];

                // Sub-fila superior: nombre de la persona
                if (assignment.name) {
                    page.drawText(String(assignment.name), {
                        x: col.nameX,
                        y: currentY,
                        size: NAME_SIZE
                    });
                }

                // Sub-fila inferior izquierda: fecha de inicio
                if (assignment.startDate) {
                    page.drawText(String(assignment.startDate), {
                        x: col.startDateX,
                        y: currentY - SUB_ROW_OFFSET,
                        size: DATE_SIZE
                    });
                }

                // Sub-fila inferior derecha: fecha de fin
                if (assignment.endDate) {
                    page.drawText(String(assignment.endDate), {
                        x: col.endDateX,
                        y: currentY - SUB_ROW_OFFSET,
                        size: DATE_SIZE
                    });
                }
            });

            currentY -= ROW_HEIGHT;
        });
    };

    // ─────────────────────────────────────────────────────────────────────────

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
                // Cargar el PDF plantilla
                const templateArrayBuffer = await fetch(pdfRoute).then(res => res.arrayBuffer());
                const pdfDoc = await PDFDocument.load(templateArrayBuffer);
                // ── 1. Obtener territorios ordenados de Firebase ──────────────
                const allTerritories = getAllTerritoriesFromFirebase(dataDeGrupo.pages);
                console.log('Total territorios:', allTerritories);
                // ── 2. Dividir territorios en grupos de 20 por página PDF ─────
                const pdfPageGroups = [];
                for (let i = 0; i < allTerritories.length; i += ROWS_PER_PDF_PAGE) {
                    pdfPageGroups.push(allTerritories.slice(i, i + ROWS_PER_PDF_PAGE));
                }
                console.log('Páginas PDF necesarias:', pdfPageGroups.length);
                // ── 3. Agregar páginas al PDF si hay más territorios que plantillas ──
                // Cargamos la plantilla fresca para copiar páginas sin texto ya dibujado
                const templateForCopy = await PDFDocument.load(templateArrayBuffer);
                const templateLastPageIndex = templateForCopy.getPageCount() - 1;
                while (pdfDoc.getPageCount() < pdfPageGroups.length) {
                    const [blankPage] = await pdfDoc.copyPages(templateForCopy, [templateLastPageIndex]);
                    pdfDoc.addPage(blankPage);
                    console.log(`✅ Nueva página añadida al PDF. Total: ${pdfDoc.getPageCount()}`);
                }
                // ── 4. Dibujar año teocrático y datos en cada página ──────────
                const allPdfPages = pdfDoc.getPages();
                pdfPageGroups.forEach((territoriesForPage, pageIndex) => {
                    const page = allPdfPages[pageIndex];
                    // Año teocrático en el encabezado de cada página
                    page.drawText(`${adjustedYear}`, { x: 140, y: 750, size: 12 });
                    // Datos de territorios: una fila por territorio
                    drawTerritoriesOnPage(page, territoriesForPage);
                    console.log(`📄 Página ${pageIndex + 1}: ${territoriesForPage.length} territorios dibujados`);
                });

                // ── 5. Guardar y mostrar el PDF ───────────────────────────────

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
                            <PDFCanvasViewer pdfUrl={pdfUrl} />
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