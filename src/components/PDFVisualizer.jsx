import React, { useEffect, useState, useMemo } from "react";
import NavbarApp from './NavbarApp';
import FooterNavbar from './FooterNavbar';
import { PDFDocument } from "pdf-lib";
import { territorios } from "./utils/_utils";
import { useDatosGrupoContext } from "./contexts/grupoContext";
import { Select, SelectItem, Button, Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import PDFCanvasViewer from "./PDFCanvasViewer";

export const PDFVisualizer = () => {
    const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const navigate = useNavigate();

    const pdfRoute = "/S-13_S.pdf";
    const {
        setNombreGrupo,
        nombreGrupo,
        folioRecords,
        territorioActivo,
        dataDeGrupo
    } = useDatosGrupoContext();

    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    // Año teocrático ajustado (inicia en septiembre)
    const now = new Date();
    const year = now.getFullYear();
    const adjustedYear = now.getMonth() >= 8 ? year + 1 : year;

    // Constantes de layout del formulario S-13-S
    const ROWS_PER_PDF_PAGE = 20;       // Filas de territorio por página
    const ASSIGNMENTS_PER_ROW = 4;     // Máximo 4 columnas "Asignado a" por fila
    const ROW_HEIGHT = 31;              // Altura de cada fila de territorio (px)
    const SUB_ROW_OFFSET = 14;         // Distancia entre sub-fila nombre y sub-fila fechas

    // Posición X de cada sección del formulario
    const COL_TERRITORY_X = 38;        // Col 1: Núm. de terr.
    const COL_LAST_DATE_X = 72;       // Col 2: Última fecha en que se completó
    const ASSIGNMENT_COLS = [
        { nameX: 139, startDateX: 139, endDateX: 194 },   // Asignado a #1
        { nameX: 245, startDateX: 245, endDateX: 300 },   // Asignado a #2
        { nameX: 351, startDateX: 351, endDateX: 406 },   // Asignado a #3
        { nameX: 457, startDateX: 457, endDateX: 512 },   // Asignado a #4
    ];

    const NAME_SIZE = 9;
    const DATE_SIZE = 9;
    const TERR_NUM_SIZE = 9;
    const FIRST_ROW_Y = 685;   // Y de la primera fila de datos en la página

    // Extraer número de territorios totales del grupo
    const totalTerritorios = useMemo(() => {
        if (territorioActivo?.mapa?.area) {
            return Object.keys(territorioActivo.mapa.area).length;
        }
        const staticGroup = territorios[nombreGrupo];
        if (staticGroup?.mapa?.area) {
            return Object.keys(staticGroup.mapa.area).length;
        }
        return 15;
    }, [territorioActivo, nombreGrupo]);

    /**
     * Construye la lista de territorios para el PDF a partir de los registros planos (folioRecords).
     */
    const extractTerritoriesForPDF = () => {
        // 1. Si tenemos folioRecords (Opción C)
        if (folioRecords && folioRecords.length > 0) {
            const list = [];
            for (let num = 1; num <= totalTerritorios; num++) {
                const recordsForTerr = folioRecords.filter(r => parseInt(r.territorioNumero) === num);
                recordsForTerr.sort((a, b) => (a.fechaInicio || '').localeCompare(b.fechaInicio || ''));

                const completedDates = recordsForTerr.filter(r => r.fechaFin).map(r => r.fechaFin);
                const lastCompleted = completedDates.length > 0 ? completedDates[completedDates.length - 1] : '';

                list.push({
                    territoryNumber: num,
                    lastCompletedDate: lastCompleted,
                    assignments: recordsForTerr.map(r => ({
                        name: r.publicador || '',
                        startDate: r.fechaInicio || '',
                        endDate: r.fechaFin || ''
                    }))
                });
            }
            return list;
        }

        // 2. Fallback a legacy dataDeGrupo.pages si existe
        if (dataDeGrupo && dataDeGrupo.pages) {
            const territories = [];
            const sortedPages = [...dataDeGrupo.pages].sort((a, b) => a.page - b.page);
            sortedPages.forEach(page => {
                const sortedColumns = [...page.columns].sort((a, b) => parseInt(a.name) - parseInt(b.name));
                sortedColumns.forEach(column => {
                    const lastRow = column.rows && column.rows.length > 0 ? column.rows[column.rows.length - 1] : null;
                    territories.push({
                        territoryNumber: column.name,
                        lastCompletedDate: lastRow ? lastRow.endDate : '',
                        assignments: (column.rows || []).map(r => ({
                            name: r.name || '',
                            startDate: r.startDate || '',
                            endDate: r.endDate || ''
                        }))
                    });
                });
            });
            if (territories.length > 0) return territories;
        }

        // 3. Fallback a lista base numerada si no hay registros
        const emptyList = [];
        for (let num = 1; num <= totalTerritorios; num++) {
            emptyList.push({
                territoryNumber: num,
                lastCompletedDate: '',
                assignments: []
            });
        }
        return emptyList;
    };

    /**
     * Dibuja todos los territorios en una página del PDF.
     */
    const drawTerritoriesOnPage = (page, territoriesForPage) => {
        let currentY = FIRST_ROW_Y;

        territoriesForPage.forEach(territory => {
            // Col 1: número de territorio
            page.drawText(String(territory.territoryNumber), {
                x: COL_TERRITORY_X + 10,
                y: currentY - 5,
                size: TERR_NUM_SIZE + 1
            });

            // Col 2: última fecha completada
            if (territory.lastCompletedDate) {
                page.drawText(String(territory.lastCompletedDate), {
                    x: COL_LAST_DATE_X + 4,
                    y: currentY - 5,
                    size: DATE_SIZE + 1
                });
            }

            // Cols 3–6: hasta 4 asignaciones en horizontal
            territory.assignments.slice(0, ASSIGNMENTS_PER_ROW).forEach((assignment, i) => {
                const col = ASSIGNMENT_COLS[i];

                // Sub-fila superior: nombre de la persona
                if (assignment.name) {
                    const cleanName = String(assignment.name).slice(0, 16);
                    page.drawText(cleanName, {
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

    useEffect(() => {
        if (!nombreGrupo) return;

        const generatePDF = async () => {
            setLoading(true);

            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
                setPdfUrl(null);
            }

            try {
                // Cargar el PDF plantilla base
                const templateArrayBuffer = await fetch(pdfRoute).then(res => res.arrayBuffer());
                const pdfDoc = await PDFDocument.load(templateArrayBuffer);

                // 1. Obtener territorios a imprimir
                const allTerritories = extractTerritoriesForPDF();

                // 2. Dividir territorios en grupos de 20 por página
                const pdfPageGroups = [];
                for (let i = 0; i < allTerritories.length; i += ROWS_PER_PDF_PAGE) {
                    pdfPageGroups.push(allTerritories.slice(i, i + ROWS_PER_PDF_PAGE));
                }
                if (pdfPageGroups.length === 0) {
                    pdfPageGroups.push([]);
                }

                // 3. Agregar páginas al PDF si se necesitan más que la plantilla
                const templateForCopy = await PDFDocument.load(templateArrayBuffer);
                const templateLastPageIndex = templateForCopy.getPageCount() - 1;
                while (pdfDoc.getPageCount() < pdfPageGroups.length) {
                    const [blankPage] = await pdfDoc.copyPages(templateForCopy, [templateLastPageIndex]);
                    pdfDoc.addPage(blankPage);
                }

                // 4. Dibujar año teocrático, nombre del grupo y datos en cada página
                const allPdfPages = pdfDoc.getPages();
                pdfPageGroups.forEach((territoriesForPage, pageIndex) => {
                    const page = allPdfPages[pageIndex];
                    page.drawText(`${adjustedYear}`, { x: 140, y: 750, size: 12 });
                    if (nombreGrupo) {
                        page.drawText(`Grupo: ${nombreGrupo}`, { x: 220, y: 750, size: 12 });
                    }
                    drawTerritoriesOnPage(page, territoriesForPage);
                });

                // 5. Guardar y generar URL Blob
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

        generatePDF();
    }, [folioRecords, nombreGrupo, totalTerritorios]);

    return (
        <>
            <NavbarApp />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-nav-safe">
                
                {/* Header & Controls Card */}
                <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-ambient border border-surface-container mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider block">
                                Documentación y Reportes
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
                                Formulario PDF S-13-S
                            </h1>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                                Registro oficial de asignación de territorios para la congregación.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            <div className="w-48">
                                <Select
                                    variant="bordered"
                                    size="sm"
                                    label="Grupo"
                                    selectedKeys={[nombreGrupo]}
                                    onChange={(e) => setNombreGrupo(e.target.value)}
                                    classNames={{
                                        trigger: "rounded-2xl border-surface-container bg-surface-container-low/50",
                                    }}
                                >
                                    {Object.keys(territorios).map(
                                        (territorio) => <SelectItem key={territorio} value={territorio}>{territorio}</SelectItem>
                                    )}
                                </Select>
                            </div>
                            
                            <Button
                                size="sm"
                                color="secondary"
                                variant="flat"
                                onPress={() => navigate('/foliotable')}
                                className="rounded-full font-bold"
                                startContent={<span className="material-symbols-outlined text-[18px]">table_chart</span>}
                            >
                                Editar en Tabla
                            </Button>
                            <Button
                                size="sm"
                                color="primary"
                                variant="flat"
                                onPress={() => navigate('/grupo')}
                                className="rounded-full font-bold"
                                startContent={<span className="material-symbols-outlined text-[18px]">map</span>}
                            >
                                Ver Manzanas
                            </Button>
                        </div>
                    </div>
                </section>

                {/* PDF Viewer Container */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-24 bg-white rounded-3xl shadow-ambient border border-surface-container">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
                        <p className="text-sm font-semibold text-primary">Generando documento oficial S-13-S...</p>
                        <p className="text-xs text-on-surface-variant mt-1">Renderizando asignaciones de territorio del Grupo {nombreGrupo}</p>
                    </div>
                ) : pdfUrl ? (
                    <section className="bg-white rounded-3xl shadow-ambient border border-surface-container p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-4 border-b border-surface-container">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[22px] text-primary">description</span>
                                <div>
                                    <h3 className="text-sm font-bold text-on-surface">
                                        Vista Previa • Formulario S-13-S (Grupo {nombreGrupo})
                                    </h3>
                                    <span className="text-xs font-mono text-on-surface-variant">Año de Servicio {adjustedYear}</span>
                                </div>
                            </div>
                            
                            <a
                                href={pdfUrl}
                                target="_blank"
                                download={`S-13-S_${nombreGrupo}_${adjustedYear}.pdf`}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-sm transition-all flex items-center gap-1.5 active-scale"
                            >
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                <span>Descargar PDF</span>
                            </a>
                        </div>

                        {esMovil ? (
                            <PDFCanvasViewer pdfUrl={pdfUrl} />
                        ) : (
                            <iframe
                                key={nombreGrupo}
                                src={pdfUrl}
                                width="100%"
                                height="700px"
                                className="border border-surface-container rounded-2xl bg-surface-container-low"
                                title="Vista previa del PDF"
                            />
                        )}
                    </section>
                ) : (
                    <div className="p-8 text-center bg-white rounded-3xl shadow-ambient border border-red-200">
                        <p className="text-red-600 font-semibold text-sm">No se pudo generar el documento PDF.</p>
                        <Button size="sm" color="primary" variant="flat" onPress={() => window.location.reload()} className="mt-3 rounded-full">
                            Reintentar
                        </Button>
                    </div>
                )}
            </main>
            <FooterNavbar />
        </>
    );
};

export default PDFVisualizer;