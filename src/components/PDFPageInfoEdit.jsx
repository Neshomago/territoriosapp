import React, { useState } from 'react';
//import { Download, Plus, Trash2 } from 'lucide-react';

export const PDFPageInfoEdit = () => {
  const [serviceYear, setServiceYear] = useState('2024');
  const [territories, setTerritories] = useState([
    {
      number: '',
      lastCompleted: '',
      assignments: [
        { assignedTo: '', assignedDate: '', completedDate: '' },
        { assignedTo: '', assignedDate: '', completedDate: '' },
        { assignedTo: '', assignedDate: '', completedDate: '' },
        { assignedTo: '', assignedDate: '', completedDate: '' }
      ]
    }
  ]);

  const ROWS_PER_PAGE = 20;

  const addTerritory = () => {
    setTerritories([...territories, {
      number: '',
      lastCompleted: '',
      assignments: [
        { assignedTo: '', assignedDate: '', completedDate: '' },
        { assignedTo: '', assignedDate: '', completedDate: '' },
        { assignedTo: '', assignedDate: '', completedDate: '' },
        { assignedTo: '', assignedDate: '', completedDate: '' }
      ]
    }]);
  };

  const removeTerritory = (index) => {
    setTerritories(territories.filter((_, i) => i !== index));
  };

  const updateTerritory = (index, field, value) => {
    const updated = [...territories];
    updated[index][field] = value;
    setTerritories(updated);
  };

  const updateAssignment = (territoryIndex, assignmentIndex, field, value) => {
    const updated = [...territories];
    updated[territoryIndex].assignments[assignmentIndex][field] = value;
    setTerritories(updated);
  };

  const generatePDF = () => {
    window.print();
  };

  // Dividir territorios en páginas (20 filas por página)
  const pages = [];
  for (let i = 0; i < territories.length; i += ROWS_PER_PAGE) {
    pages.push(territories.slice(i, i + ROWS_PER_PAGE));
  }

  // Si no hay páginas, crear una vacía
  if (pages.length === 0) {
    pages.push([]);
  }

  // Crear filas vacías para completar las 20 filas de cada página
  const createEmptyTerritory = () => ({
    number: '',
    lastCompleted: '',
    assignments: [
      { assignedTo: '', assignedDate: '', completedDate: '' },
      { assignedTo: '', assignedDate: '', completedDate: '' },
      { assignedTo: '', assignedDate: '', completedDate: '' },
      { assignedTo: '', assignedDate: '', completedDate: '' }
    ]
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Controles - No se imprimen */}
      <div className="max-w-7xl mx-auto mb-4 print:hidden">
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Año de servicio
              </label>
              <input
                type="text"
                value={serviceYear}
                onChange={(e) => setServiceYear(e.target.value)}
                className="border rounded px-3 py-2 w-32"
              />
            </div>
            <button
              onClick={addTerritory}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ➕
              Agregar Territorio
            </button>
            <div className="text-sm text-gray-600">
              Total territorios: {territories.length} | Páginas: {pages.length}
            </div>
          </div>
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
          ⬇️
            Generar PDF
          </button>
        </div>
      </div>

      {/* Páginas A4 */}
      {pages.map((pageTerritories, pageIndex) => {
        // Completar con filas vacías hasta llegar a 20
        const rowsToDisplay = [...pageTerritories];
        while (rowsToDisplay.length < ROWS_PER_PAGE) {
          rowsToDisplay.push(createEmptyTerritory());
        }

        return (
          <div
            key={pageIndex}
            className="a4-page bg-white mx-auto mb-8 shadow-lg"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '12mm',
              pageBreakAfter: 'always'
            }}
          >
            {/* Encabezado */}
            <div className="text-center mb-3">
              <h1 className="text-lg font-bold mb-0.5">S-13-S 1/22</h1>
              <h2 className="text-base font-bold">REGISTRO DE ASIGNACIÓN DE TERRITORIO</h2>
            </div>

            {/* Tabla */}
            <table className="w-full border-collapse" style={{ fontSize: '9px' }}>
              <thead>
                <tr className="border-2 border-black">
                  <th className="border-2 border-black p-0.5 w-10">
                    Núm.<br />de terr.
                  </th>
                  <th className="border-2 border-black p-0.5 w-16">
                    Última fecha<br />en que se<br />completó*
                  </th>
                  <th className="border-2 border-black p-0.5" colSpan="3">Asignado a</th>
                  <th className="border-2 border-black p-0.5" colSpan="3">Asignado a</th>
                  <th className="border-2 border-black p-0.5" colSpan="3">Asignado a</th>
                  <th className="border-2 border-black p-0.5" colSpan="3">Asignado a</th>
                </tr>
                <tr className="border-2 border-black">
                  <th className="border-2 border-black p-0.5"></th>
                  <th className="border-2 border-black p-0.5"></th>
                  {[1, 2, 3, 4].map((i) => (
                    <React.Fragment key={i}>
                      <th className="border-2 border-black p-0.5">Nombre</th>
                      <th className="border-2 border-black p-0.5 w-14">
                        Fecha en<br />que se<br />asignó
                      </th>
                      <th className="border-2 border-black p-0.5 w-14">
                        Fecha en<br />que se<br />completó
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowsToDisplay.map((territory, tIndex) => {
                  const globalIndex = pageIndex * ROWS_PER_PAGE + tIndex;
                  const isRealTerritory = globalIndex < territories.length;
                  
                  return (
                    <tr key={tIndex} className="border border-black" style={{ height: '24px' }}>
                      <td className="border border-black p-0.5 text-center">
                        {isRealTerritory ? (
                          <input
                            type="text"
                            value={territory.number}
                            onChange={(e) => updateTerritory(globalIndex, 'number', e.target.value)}
                            className="w-full text-center print:border-0 border rounded px-0.5"
                            style={{ height: '20px', fontSize: '9px' }}
                          />
                        ) : (
                          <div style={{ height: '20px' }}></div>
                        )}
                      </td>
                      <td className="border border-black p-0.5 text-center">
                        {isRealTerritory ? (
                          <input
                            type="text"
                            value={territory.lastCompleted}
                            onChange={(e) => updateTerritory(globalIndex, 'lastCompleted', e.target.value)}
                            className="w-full text-center print:border-0 border rounded px-0.5"
                            style={{ height: '20px', fontSize: '9px' }}
                          />
                        ) : (
                          <div style={{ height: '20px' }}></div>
                        )}
                      </td>
                      {territory.assignments.map((assignment, aIndex) => (
                        <React.Fragment key={aIndex}>
                          <td className="border border-black p-0.5">
                            {isRealTerritory ? (
                              <input
                                type="text"
                                value={assignment.assignedTo}
                                onChange={(e) => updateAssignment(globalIndex, aIndex, 'assignedTo', e.target.value)}
                                className="w-full print:border-0 border rounded px-0.5"
                                style={{ height: '20px', fontSize: '9px' }}
                              />
                            ) : (
                              <div style={{ height: '20px' }}></div>
                            )}
                          </td>
                          <td className="border border-black p-0.5">
                            {isRealTerritory ? (
                              <input
                                type="text"
                                value={assignment.assignedDate}
                                onChange={(e) => updateAssignment(globalIndex, aIndex, 'assignedDate', e.target.value)}
                                className="w-full text-center print:border-0 border rounded px-0.5"
                                style={{ height: '20px', fontSize: '9px' }}
                              />
                            ) : (
                              <div style={{ height: '20px' }}></div>
                            )}
                          </td>
                          <td className="border border-black p-0.5">
                            {isRealTerritory ? (
                              <input
                                type="text"
                                value={assignment.completedDate}
                                onChange={(e) => updateAssignment(globalIndex, aIndex, 'completedDate', e.target.value)}
                                className="w-full text-center print:border-0 border rounded px-0.5"
                                style={{ height: '20px', fontSize: '9px' }}
                              />
                            ) : (
                              <div style={{ height: '20px' }}></div>
                            )}
                          </td>
                        </React.Fragment>
                      ))}
                      {isRealTerritory && (
                        <td className="border-0 print:hidden p-0.5">
                          <button
                            onClick={() => removeTerritory(globalIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                          🗑️
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Nota al pie */}
            <div className="mt-2" style={{ fontSize: '9px' }}>
              <p>*Cuando comience una nueva página, anote en esta columna la última fecha en que los territorios se completaron.</p>
              <p className="mt-1"><strong>Año de servicio:</strong> {serviceYear}</p>
            </div>
          </div>
        );
      })}

      {/* Estilos de impresión */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .a4-page {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 12mm;
            box-shadow: none;
            page-break-after: always;
          }
          .a4-page:last-child {
            page-break-after: auto;
          }
          input {
            border: none !important;
            background: transparent !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
        }
        @page {
          size: A4;
          margin: 0;
        }
      `}</style>
    </div>
  );
};
