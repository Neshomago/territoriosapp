import { complex } from "framer-motion";
import { newlineChars } from "pdf-lib";

export const territorios = {
    Mejía: {
        name: 'Mejía',
        mapa: {
            imagen: new URL('./../assets/territorio-mejia.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'12/20/2024',
                    fechaFin:'15/20/2024',
                    manzanas: [
                        {name: 1, completed: 1},
                        {name: 2, completed: 1},
                        {name: 3, completed: 1},
                        {name: 4, completed: true},
                        {name: 5, completed: true},
                        {name: 6, completed: true},
                        {name: 7, completed: true},
                        {name: 8, completed: false},
                        {name: 9, completed: false},
                        {name: 10, completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'12/20/2024',
                    fechaFin:'',
                    manzanas: [
                        {name: 1, completed: true},
                        {name: 2, completed: true},
                        {name: 3, completed: true},
                        {name: 4, completed: true},
                        {name: 5, completed: false},
                        {name: 6, completed: false},
                        {name: 7, completed: false}
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'12/20/2024',
                    fechaFin:'',
                    manzanas: [
                        {name: 1, completed: false},
                        {name: 2, completed: false},
                        {name: 3, completed: false},
                        {name: 4, completed: false},
                        {name: 5, completed: false},
                        {name: 6, completed: false},
                        {name: 7, completed: false}
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'12/20/2024',
                    fechaFin:'',
                    manzanas: [
                        {name: 1, completed: false},
                        {name: 2, completed: false},
                        {name: 3, completed: false},
                        {name: 4, completed: false},
                        {name: 5, completed: false},
                        {name: 6, completed: false},
                        {name: 7, completed: false}
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'12/20/2024',
                    fechaFin:'',
                    manzanas: [
                        {name: 1, completed: false},
                        {name: 2, completed: false},
                        {name: 3, completed: false},
                        {name: 4, completed: false},
                        {name: 5, completed: false},
                        {name: 6, completed: false},
                        {name: 7, completed: false}
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'12/20/2024',
                    fechaFin:'',
                    manzanas: [
                        {name: 1, completed: false},
                        {name: 2, completed: false},
                        {name: 3, completed: false},
                        {name: 4, completed: false},
                        {name: 5, completed: false},
                        {name: 6, completed: false},
                        {name: 7, completed: false}
                    ]
                },
            }
        }
    },
    Murillo: {
        name: 'Murillo',
        mapa: {
            imagen: new URL('./../assets/territorio-mejia.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DK', completed: false},
                        {name: 'GD-1', completed: false},
                        {name: 'GD-2', completed: false},
                        {name: 'FK', completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DL', completed: false},
                        {name: 'DM', completed: false},
                        {name: 'EF', completed: false},
                        {name: 'GE-1', completed: false},
                        {name: 'GE-2', completed: false},
                        {name: 'FM', completed: false},
                        {name: 'FL', completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DN', completed: false},
                        {name: 'DO', completed: false},
                        {name: 'EG', completed: false},
                        {name: 'EP', completed: false},
                        {name: 'FO', completed: false},
                        {name: 'FN', completed: false},
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DP', completed: false},
                        {name: 'DQ', completed: false},
                        {name: 'EH', completed: false},
                        {name: 'EQ', completed: false},
                        {name: 'FQ', completed: false},
                        {name: 'FP', completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DR', completed: false},
                        {name: 'GF-1', completed: false},
                        {name: 'GF-2', completed: false},
                        {name: 'GG-1', completed: false},
                        {name: 'GG-2', completed: false},
                        {name: 'FR', completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DS', completed: false},
                        {name: 'DT', completed: false},
                        {name: 'EI', completed: false},
                        {name: 'ER', completed: false},
                        {name: 'FT', completed: false},
                        {name: 'FS', completed: false},
                    ]
                },
                terr7: {
                    name: 'territorio 7',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DU', completed: false},
                        {name: 'EJ', completed: false},
                        {name: 'ES', completed: false},
                        {name: 'FU', completed: false},
                    ]
                }
            }
        }
    },
    'Jara': {
        name: 'Jara',
        mapa: {
            imagen: new URL('./../assets/territorio-mejia.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'IA', completed: false},
                        {name: 'IB', completed: false},
                        {name: 'IC', completed: false},
                        {name: 'ID', completed: false},
                        {name: 'IE', completed: false},
                        {name: 'IF', completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'IG', completed: false},
                        {name: 'IH', completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'II', completed: false},
                        {name: 'IJ', completed: false},
                        {name: 'IK', completed: false},
                        {name: 'IL', completed: false},
                        {name: 'IM', completed: false},
                        {name: 'IN', completed: false},
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'IO', completed: false},
                        {name: 'IP', completed: false},
                        {name: 'IQ', completed: false},
                        {name: 'IR', completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'CA', completed: false},
                        {name: 'CB', completed: false},
                        {name: 'CC', completed: false},
                        {name: 'CD', completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'CC', completed: false},
                        {name: 'CR', completed: false},
                        {name: 'CF', completed: false},
                        {name: 'CG', completed: false},
                    ]
                }
            }
        }
    },
    'Mosquera(noche)': {
        name: 'Mosquera(noche)',
        mapa: {
            imagen: new URL('./../assets/territorio-mejia.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'CS', completed: false},
                        {name: 'CH', completed: false},
                        {name: 'CI', completed: false},
                        {name: 'CX', completed: false},
                        {name: 'CJ', completed: false},
                        {name: 'CK', completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'CL', completed: false},
                        {name: 'CM', completed: false},
                        {name: 'CN', completed: false},
                        {name: 'CO', completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DA', completed: false},
                        {name: 'DB', completed: false},
                        {name: 'DC', completed: false},
                        {name: 'DD', completed: false},
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DE', completed: false},
                        {name: 'DF', completed: false},
                        {name: 'DG', completed: false},
                        {name: 'DH', completed: false},
                        {name: 'DI', completed: false},
                        {name: 'DJ', completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DK', completed: false},
                        {name: 'DSC-1', completed: false},
                        {name: 'DSC-2', completed: false},
                        {name: 'DL', completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DM', completed: false},
                        {name: 'DN', completed: false},
                        {name: 'DO', completed: false},
                        {name: 'DP', completed: false},
                        {name: 'DQ', completed: false},
                        {name: 'DR', completed: false},
                    ]
                }
            }
        }
    },
    'Mosquera(mañana)': {
        name: 'Mosquera(mañana)',
        mapa: {
            imagen: new URL('./../assets/territorio-mejia.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DA', completed: false},
                        {name: 'EA', completed: false},
                        {name: 'EK', completed: false},
                        {name: 'FA', completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DB', completed: false},
                        {name: 'DC', completed: false},
                        {name: 'EB', completed: false},
                        {name: 'EL', completed: false},
                        {name: 'FC', completed: false},
                        {name: 'FB', completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DD', completed: false},
                        {name: 'GB-1', completed: false},
                        {name: 'GB-2', completed: false},
                        {name: 'GC-1', completed: false},
                        {name: 'GC-2', completed: false},
                        {name: 'FD', completed: false},
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'ED', completed: false},
                        {name: 'FD', completed: false},
                        {name: 'EC', completed: false},
                        {name: 'EM', completed: false},
                        {name: 'FF', completed: false},
                        {name: 'FE', completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DG', completed: false},
                        {name: 'DH', completed: false},
                        {name: 'ED', completed: false},
                        {name: 'EN', completed: false},
                        {name: 'FH', completed: false},
                        {name: 'FG', completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DI', completed: false},
                        {name: 'DJ', completed: false},
                        {name: 'EE', completed: false},
                        {name: 'EO', completed: false},
                        {name: 'FJ', completed: false},
                        {name: 'FI', completed: false},
                    ]
                }
            }
        }
    },
    'Echeverría': {
        name: 'Echeverría',
        mapa: {
            imagen: new URL('./../assets/territorio-mejia.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '37', completed: false},
                        {name: '38', completed: false},
                        {name: '39', completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '40', completed: false},
                        {name: '41', completed: false},
                        {name: '42', completed: false},
                        {name: '43', completed: false},
                        {name: '44', completed: false},
                        {name: '45', completed: false},
                        {name: '46', completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '27', completed: false},
                        {name: '28', completed: false},
                        {name: '29', completed: false},
                        {name: '35', completed: false},
                        {name: '36', completed: false},
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '19', completed: false},
                        {name: '20', completed: false},
                        {name: '21', completed: false},
                        {name: '22', completed: false},
                        {name: '25', completed: false},
                        {name: '26', completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '13', completed: false},
                        {name: '12', completed: false},
                        {name: '11', completed: false},
                        {name: '6', completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '10', completed: false},
                        {name: '9', completed: false},
                        {name: '5', completed: false},
                    ]
                },
                terr7: {
                    name: 'territorio 7',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '8', completed: false},
                        {name: '7', completed: false},
                        {name: '4', completed: false},
                    ]
                },
                terr8: {
                    name: 'territorio 8',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '14', completed: false},
                        {name: '15', completed: false},
                        {name: '16', completed: false},
                        {name: '23', completed: false},
                    ]
                },
                terr9: {
                    name: 'territorio 9',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '17', completed: false},
                        {name: '18', completed: false},
                        {name: '24', completed: false},
                    ]
                },
                terr10: {
                    name: 'territorio 10',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '32', completed: false},
                        {name: '33', completed: false},
                        {name: '34', completed: false},
                    ]
                },
                terr11: {
                    name: 'territorio 11',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '30', completed: false},
                        {name: '31', completed: false},
                    ]
                },
            }
        }
    },
    'Villareal': {
        name: 'Villareal',
        mapa: {
            imagen: new URL('./../assets/territorio-mejia.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '903', completed: false},
                        {name: '904', completed: false},
                        {name: '905', completed: false},
                        {name: '906', completed: false},
                        {name: '907', completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '908', completed: false},
                        {name: '909', completed: false},
                        {name: '910', completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '911', completed: false},
                        {name: '912', completed: false},
                        {name: '913', completed: false},
                        {name: '914', completed: false},
                        {name: '915', completed: false},
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '916', completed: false},
                        {name: '917', completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '918', completed: false},
                        {name: '919', completed: false},
                        {name: '920', completed: false},
                        {name: '921', completed: false},
                        {name: '922', completed: false},
                        {name: '923', completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '928', completed: false},
                        {name: '929', completed: false},
                    ]
                }
            }
        }
    },
    'León': {
        name: 'León',
        mapa: {
            imagen: new URL('./../assets/territorio-mejia.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '924', completed: false},
                        {name: '925', completed: false},
                        {name: '926', completed: false},
                        {name: '927', completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '930', completed: false},
                        {name: '931', completed: false},
                        {name: '932', completed: false},
                        {name: '933', completed: false},
                        {name: '936', completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '934', completed: false},
                        {name: '935', completed: false},
                        {name: '937', completed: false},
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '938', completed: false},
                        {name: '939', completed: false},
                        {name: '940', completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '941', completed: false},
                        {name: '942', completed: false},
                        {name: '945', completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '943', completed: false},
                        {name: '944', completed: false},
                    ]
                },
                terr7: {
                    name: 'territorio 7',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '946', completed: false},
                        {name: '47', completed: false},
                        {name: '48', completed: false},
                        {name: '53', completed: false},
                    ]
                },
                terr8: {
                    name: 'territorio 8',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '49', completed: false},
                        {name: '50', completed: false},
                        {name: '51', completed: false},
                        {name: '52', completed: false},
                        {name: '54', completed: false},
                        {name: '55', completed: false},
                    ]
                },
            }
        }
    },
}

//25 filas x 5 columnas, Lado A y Lado B
export const doc_S13_S_data = [
    {
        name: 'Murillo',
        lastUpdatedDate: '2024-14-12',
        completed: false,
        pages: [
            {
                page: 1,
                columns: [
                    {
                        name: '1',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '2',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '3',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '4',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '5',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                ],
            },
            {
                page: 2,
                columns: [
                    {
                        name: '1',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '2',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '3',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '4',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '5',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                ],
            },
            {
                page: 3,
                columns: [
                    {
                        name: '1',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '2',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '3',
                        completed: false,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                        ]
                    },
                    {
                        name: '4',
                        completed: false,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                        ]
                    },
                    {
                        name: '5',
                        completed: false,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                        ]
                    },
                ],
            },
            {
                page: 4,
                columns: [
                    {
                        name: '1',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '2',
                        completed: false,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '3',
                        completed: false,
                        rows: [
                        ]
                    },
                    {
                        name: '4',
                        completed: false,
                        rows: [
                        ]
                    },
                    {
                        name: '5',
                        completed: false,
                        rows: [
                        ]
                    },
                ],
            },
        ]
    },
    {
        name: 'Jara',
        lastUpdatedDate: '2024-14-12',
        completed: false,
        pages: [
            {
                page: 1,
                columns: [
                    {
                        name: '1',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '2',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '3',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '4',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '5',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                ],
            },
            {
                page: 2,
                columns: [
                    {
                        name: '6',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                    {
                        name: '7',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                            { name: 'G. Rodríguez', startDate: '19/10/24', endDate: '21/10/24' },
                            { name: 'H. Pérez', startDate: '20/10/24', endDate: '22/10/24' },
                            { name: 'I. Gómez', startDate: '21/10/24', endDate: '23/10/24' },
                            { name: 'J. Díaz', startDate: '22/10/24', endDate: '24/10/24' },
                            { name: 'K. Romero', startDate: '23/10/24', endDate: '25/10/24' },
                            { name: 'L. Morales', startDate: '24/10/24', endDate: '26/10/24' },
                            { name: 'M. Herrera', startDate: '25/10/24', endDate: '27/10/24' },
                            { name: 'N. Castro', startDate: '26/10/24', endDate: '28/10/24' },
                            { name: 'O. Ramos', startDate: '27/10/24', endDate: '29/10/24' },
                            { name: 'P. Vega', startDate: '28/10/24', endDate: '30/10/24' },
                            { name: 'Q. Ruiz', startDate: '29/10/24', endDate: '31/10/24' },
                            { name: 'R. Ortiz', startDate: '30/10/24', endDate: '01/11/24' },
                            { name: 'S. Jiménez', startDate: '31/10/24', endDate: '02/11/24' },
                            { name: 'T. Navarro', startDate: '01/11/24', endDate: '03/11/24' },
                            { name: 'U. Cruz', startDate: '02/11/24', endDate: '04/11/24' },
                            { name: 'V. Mendoza', startDate: '03/11/24', endDate: '05/11/24' },
                            { name: 'W. Peña', startDate: '04/11/24', endDate: '06/11/24' },
                            { name: 'X. Domínguez', startDate: '05/11/24', endDate: '07/11/24' },
                            { name: 'Y. Cabrera', startDate: '06/11/24', endDate: '08/11/24' }
                        ]
                    },
                ],
            },
            {
                page: 3,
                columns: [
                    {
                        name: '1',
                        completed: false,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                        ]
                    },
                    {
                        name: '2',
                        completed: false,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                        ]
                    },
                    {
                        name: '3',
                        completed: false,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                            { name: 'E. González', startDate: '17/10/24', endDate: '19/10/24' },
                            { name: 'F. Martínez', startDate: '18/10/24', endDate: '20/10/24' },
                        ]
                    },
                    {
                        name: '4',
                        completed: false,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                        ]
                    },
                    {
                        name: '5',
                        completed: false,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                        ]
                    },
                ],
            },
            {
                page: 4,
                columns: [
                    {
                        name: '6',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                        ]
                    },
                    {
                        name: '7',
                        completed: true,
                        rows: [
                            { name: 'A. Torres', startDate: '13/10/24', endDate: '15/10/24' },
                            { name: 'B. Sánchez', startDate: '14/10/24', endDate: '16/10/24' },
                            { name: 'C. López', startDate: '15/10/24', endDate: '17/10/24' },
                            { name: 'D. Fernández', startDate: '16/10/24', endDate: '18/10/24' },
                        ]
                    },
                ],
            },
        ]
    },
];

export const RESTART_DATA_FOR_GROUP = {
    Mejía: {
        name: 'Mejía',
        mapa: {
            imagen: new URL('./../assets/territorio-mejia.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 4, completed: false},
                        {name: 5, completed: false},
                        {name: 6, completed: false},
                        {name: 7, completed: false},
                        {name: 8, completed: false},
                        {name: 9, completed: false},
                        {name: 10, completed: false},
                        {name: 12, completed: false},
                        {name: 13, completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 14, completed: false},
                        {name: 15, completed: false},
                        {name: 16, completed: false},
                        {name: 17, completed: false},
                        {name: 18, completed: false},
                        {name: 23, completed: false},
                        {name: 24, completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 19, completed: false},
                        {name: 20, completed: false},
                        {name: 25, completed: false},
                        {name: 27, completed: false},
                        {name: 28, completed: false},
                        {name: 35, completed: false},
                        {name: 41, completed: false},
                        {name: 43, completed: false}
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 21, completed: false},
                        {name: 22, completed: false},
                        {name: 26, completed: false},
                        {name: 29, completed: false},
                        {name: 36, completed: false},
                        {name: 42, completed: false},
                        {name: 44, completed: false},
                        {name: 45, completed: false},
                        {name: 46, completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 30, completed: false},
                        {name: 31, completed: false},
                        {name: 32, completed: false},
                        {name: 33, completed: false},
                        {name: 34, completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 37, completed: false},
                        {name: 38, completed: false},
                        {name: 39, completed: false},
                        {name: 45, completed: false},
                    ]
                },
            }
        }
    },
    Jara: {
        name: 'Jara',
        mapa: {
            imagen: new URL('./../assets/territorio-jara.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DK', completed: false},
                        {name: 'GD-1', completed: false},
                        {name: 'GD-2', completed: false},
                        {name: 'FK', completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DL', completed: false},
                        {name: 'DM', completed: false},
                        {name: 'EF', completed: false},
                        {name: 'GE-1', completed: false},
                        {name: 'GE-2', completed: false},
                        {name: 'FM', completed: false},
                        {name: 'FL', completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DN', completed: false},
                        {name: 'DO', completed: false},
                        {name: 'EG', completed: false},
                        {name: 'EP', completed: false},
                        {name: 'FO', completed: false},
                        {name: 'FN', completed: false},
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DP', completed: false},
                        {name: 'DQ', completed: false},
                        {name: 'EH', completed: false},
                        {name: 'EQ', completed: false},
                        {name: 'FQ', completed: false},
                        {name: 'FP', completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DR', completed: false},
                        {name: 'GF-1', completed: false},
                        {name: 'GF-2', completed: false},
                        {name: 'GG-1', completed: false},
                        {name: 'GG-2', completed: false},
                        {name: 'FR', completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DS', completed: false},
                        {name: 'DT', completed: false},
                        {name: 'EI', completed: false},
                        {name: 'ER', completed: false},
                        {name: 'FT', completed: false},
                        {name: 'FS', completed: false},
                    ]
                },
                terr7: {
                    name: 'territorio 7',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DU', completed: false},
                        {name: 'EJ', completed: false},
                        {name: 'ES', completed: false},
                        {name: 'FU', completed: false},
                    ]
                }
            }
        }
    },
    'Murillo': {
        name: 'Murillo',
        mapa: {
            imagen: new URL('./../assets/territorio-murillo.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'IA', completed: false},
                        {name: 'IB', completed: false},
                        {name: 'IC', completed: false},
                        {name: 'ID', completed: false},
                        {name: 'IE', completed: false},
                        {name: 'IF', completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'IG', completed: false},
                        {name: 'IH', completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'II', completed: false},
                        {name: 'IJ', completed: false},
                        {name: 'IK', completed: false},
                        {name: 'IL', completed: false},
                        {name: 'IM', completed: false},
                        {name: 'IN', completed: false},
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'IO', completed: false},
                        {name: 'IP', completed: false},
                        {name: 'IQ', completed: false},
                        {name: 'IR', completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'CA', completed: false},
                        {name: 'CB', completed: false},
                        {name: 'CC', completed: false},
                        {name: 'CD', completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'CC', completed: false},
                        {name: 'CR', completed: false},
                        {name: 'CF', completed: false},
                        {name: 'CG', completed: false},
                    ]
                }
            }
        }
    },
    'Mosquera(noche)': {
        name: 'Mosquera(noche)',
        mapa: {
            imagen: new URL('./../assets/territorio-mosquera.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'CS', completed: false},
                        {name: 'CH', completed: false},
                        {name: 'CI', completed: false},
                        {name: 'CX', completed: false},
                        {name: 'CJ', completed: false},
                        {name: 'CK', completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'CL', completed: false},
                        {name: 'CM', completed: false},
                        {name: 'CN', completed: false},
                        {name: 'CO', completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DA', completed: false},
                        {name: 'DB', completed: false},
                        {name: 'DC', completed: false},
                        {name: 'DD', completed: false},
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DE', completed: false},
                        {name: 'DF', completed: false},
                        {name: 'DG', completed: false},
                        {name: 'DH', completed: false},
                        {name: 'DI', completed: false},
                        {name: 'DJ', completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DK', completed: false},
                        {name: 'DSC-1', completed: false},
                        {name: 'DSC-2', completed: false},
                        {name: 'DL', completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DM', completed: false},
                        {name: 'DN', completed: false},
                        {name: 'DO', completed: false},
                        {name: 'DP', completed: false},
                        {name: 'DQ', completed: false},
                        {name: 'DR', completed: false},
                    ]
                }
            }
        }
    },
    'Mosquera(mañana)': {
        name: 'Mosquera(mañana)',
        mapa: {
            imagen: new URL('./../assets/territorio-mosquera-dia.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DA', completed: false},
                        {name: 'EA', completed: false},
                        {name: 'EK', completed: false},
                        {name: 'FA', completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DB', completed: false},
                        {name: 'DC', completed: false},
                        {name: 'EB', completed: false},
                        {name: 'EL', completed: false},
                        {name: 'FC', completed: false},
                        {name: 'FB', completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DD', completed: false},
                        {name: 'GB-1', completed: false},
                        {name: 'GB-2', completed: false},
                        {name: 'GC-1', completed: false},
                        {name: 'GC-2', completed: false},
                        {name: 'FD', completed: false},
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'ED', completed: false},
                        {name: 'FD', completed: false},
                        {name: 'EC', completed: false},
                        {name: 'EM', completed: false},
                        {name: 'FF', completed: false},
                        {name: 'FE', completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DG', completed: false},
                        {name: 'DH', completed: false},
                        {name: 'ED', completed: false},
                        {name: 'EN', completed: false},
                        {name: 'FH', completed: false},
                        {name: 'FG', completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 'DI', completed: false},
                        {name: 'DJ', completed: false},
                        {name: 'EE', completed: false},
                        {name: 'EO', completed: false},
                        {name: 'FJ', completed: false},
                        {name: 'FI', completed: false},
                    ]
                }
            }
        }
    },
    'Echeverría': {
        name: 'Echeverría',
        mapa: {
            imagen: new URL('./../assets/territorio-echeverria.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '37', completed: false},
                        {name: '38', completed: false},
                        {name: '39', completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '40', completed: false},
                        {name: '41', completed: false},
                        {name: '42', completed: false},
                        {name: '43', completed: false},
                        {name: '44', completed: false},
                        {name: '45', completed: false},
                        {name: '46', completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '27', completed: false},
                        {name: '28', completed: false},
                        {name: '29', completed: false},
                        {name: '35', completed: false},
                        {name: '36', completed: false},
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '19', completed: false},
                        {name: '20', completed: false},
                        {name: '21', completed: false},
                        {name: '22', completed: false},
                        {name: '25', completed: false},
                        {name: '26', completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '13', completed: false},
                        {name: '12', completed: false},
                        {name: '11', completed: false},
                        {name: '6', completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '10', completed: false},
                        {name: '9', completed: false},
                        {name: '5', completed: false},
                    ]
                },
                terr7: {
                    name: 'territorio 7',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '8', completed: false},
                        {name: '7', completed: false},
                        {name: '4', completed: false},
                    ]
                },
                terr8: {
                    name: 'territorio 8',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '14', completed: false},
                        {name: '15', completed: false},
                        {name: '16', completed: false},
                        {name: '23', completed: false},
                    ]
                },
                terr9: {
                    name: 'territorio 9',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '17', completed: false},
                        {name: '18', completed: false},
                        {name: '24', completed: false},
                    ]
                },
                terr10: {
                    name: 'territorio 10',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '32', completed: false},
                        {name: '33', completed: false},
                        {name: '34', completed: false},
                    ]
                },
                terr11: {
                    name: 'territorio 11',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '30', completed: false},
                        {name: '31', completed: false},
                    ]
                },
            }
        }
    },
    'Villareal': {
        name: 'Villareal',
        mapa: {
            imagen: new URL('./../assets/territorio-villareal.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 4, completed: false},
                        {name: 7, completed: false},
                        {name: 8, completed: false},
                        {name: 9.1, completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 5, completed: false},
                        {name: 9.2, completed: false},
                        {name: 10, completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 6, completed: false},
                        {name: 11, completed: false},
                        {name: 12, completed: false},
                        {name: 13, completed: false}
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 14, completed: false},
                        {name: 15, completed: false},
                        {name: 16.1, completed: false},
                        {name: 23, completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 16.2, completed: false},
                        {name: 17, completed: false},
                        {name: 18, completed: false},
                        {name: 24, completed: false}
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 19, completed: false},
                        {name: 20, completed: false},
                        {name: 21, completed: false},
                        {name: 22, completed: false},
                        {name: 25, completed: false},
                        {name: 26, completed: false},
                    ]
                },
                terr7: {
                    name: 'territorio 7',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 27, completed: false},
                        {name: 28, completed: false},
                        {name: 29, completed: false},
                        {name: 35, completed: false},
                        {name: 36, completed: false},
                    ]
                },
                terr8: {
                    name: 'territorio 8',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 30, completed: false},
                        {name: 31, completed: false},
                        {name: 32, completed: false},
                        {name: 33, completed: false},
                        {name: 34, completed: false},
                    ]
                },
                terr9: {
                    name: 'territorio 9',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 37, completed: false},
                        {name: 38, completed: false},
                        {name: 39, completed: false}
                    ]
                },
                terr10: {
                    name: 'territorio 10',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: 40, completed: false},
                        {name: 41, completed: false},
                        {name: 42, completed: false},
                        {name: 43, completed: false},
                        {name: 44, completed: false},
                        {name: 45, completed: false},
                        {name: 46, completed: false},
                    ]
                },
            }
        }
    },
    'León': {
        name: 'León',
        mapa: {
            imagen: new URL('./../assets/territorio-leon.png', import.meta.url).href,
            area: {
                terr1: {
                    name: 'territorio 1',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '924', completed: false},
                        {name: '925', completed: false},
                        {name: '926', completed: false},
                        {name: '927', completed: false},
                    ]
                },
                terr2: {
                    name: 'territorio 2',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '930', completed: false},
                        {name: '931', completed: false},
                        {name: '932', completed: false},
                        {name: '933', completed: false},
                        {name: '936', completed: false},
                    ]
                },
                terr3: {
                    name: 'territorio 3',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '934', completed: false},
                        {name: '935', completed: false},
                        {name: '937', completed: false},
                    ]
                },
                terr4: {
                    name: 'territorio 4',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '938', completed: false},
                        {name: '939', completed: false},
                        {name: '940', completed: false},
                    ]
                },
                terr5: {
                    name: 'territorio 5',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '941', completed: false},
                        {name: '942', completed: false},
                        {name: '945', completed: false},
                    ]
                },
                terr6: {
                    name: 'territorio 6',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '943', completed: false},
                        {name: '944', completed: false},
                    ]
                },
                terr7: {
                    name: 'territorio 7',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '946', completed: false},
                        {name: '47', completed: false},
                        {name: '48', completed: false},
                        {name: '53', completed: false},
                    ]
                },
                terr8: {
                    name: 'territorio 8',
                    fechaInicio:'',
                    fechaFin:'',
                    manzanas: [
                        {name: '49', completed: false},
                        {name: '50', completed: false},
                        {name: '51', completed: false},
                        {name: '52', completed: false},
                        {name: '54', completed: false},
                        {name: '55', completed: false},
                    ]
                },
            }
        }
    },
}

export const RESTART_DATA_FOR_GROUP_S13_MURILLO = {
    name: 'Murillo',
    lastUpdatedDate: '',
    completed: false,
    pages: [
        {
            page: 1,
            columns: [
                {
                    name: '1',
                    completed: false,
                    rows: []
                },
                {
                    name: '2',
                    completed: false,
                    rows: []
                },
                {
                    name: '3',
                    completed: false,
                    rows: []
                },
                {
                    name: '4',
                    completed: false,
                    rows: []
                },
                {
                    name: '5',
                    completed: false,
                    rows: []
                },
            ],
        },
        {
            page: 2,
            columns: [
                {
                    name: '6',
                    completed: false,
                    rows: []
                }
            ],
        }
    ]
}
export const RESTART_DATA_FOR_GROUP_S13_MOSQUERAN = {
    name: 'Mosquera(noche)',
    lastUpdatedDate: '',
    completed: false,
    pages: [
        {
            page: 1,
            columns: [
                {
                    name: '1',
                    completed: false,
                    rows: []
                },
                {
                    name: '2',
                    completed: false,
                    rows: []
                },
                {
                    name: '3',
                    completed: false,
                    rows: []
                },
                {
                    name: '4',
                    completed: false,
                    rows: []
                },
                {
                    name: '5',
                    completed: false,
                    rows: []
                },
            ],
        },
        {
            page: 2,
            columns: [
                {
                    name: '6',
                    completed: false,
                    rows: []
                },
                {
                    name: '7',
                    completed: false,
                    rows: []
                },
            ],
        },
    ]
}
export const RESTART_DATA_FOR_GROUP_S13_MOSQUERAD =  {
    name: 'Mosquera(mañana)',
    lastUpdatedDate: '',
    completed: false,
    pages: [
        {
            page: 1,
            columns: [
                {
                    name: '1',
                    completed: false,
                    rows: []
                },
                {
                    name: '2',
                    completed: false,
                    rows: []
                },
                {
                    name: '3',
                    completed: false,
                    rows: []
                },
                {
                    name: '4',
                    completed: false,
                    rows: []
                },
                {
                    name: '5',
                    completed: false,
                    rows: []
                },
            ],
        },
        {
            page: 2,
            columns: [
                {
                    name: '6',
                    completed: false,
                    rows: []
                },
                {
                    name: '7',
                    completed: false,
                    rows: []
                },
            ],
        },
    ]
}
export const RESTART_DATA_FOR_GROUP_S13_LEON = {
    name: 'León',
    lastUpdatedDate: '',
    completed: false,
    pages: [
        {
            page: 1,
            columns: [
                {
                    name: '1',
                    completed: false,
                    rows: []
                },
                {
                    name: '2',
                    completed: false,
                    rows: []
                },
                {
                    name: '3',
                    completed: false,
                    rows: []
                },
                {
                    name: '4',
                    completed: false,
                    rows: []
                },
                {
                    name: '5',
                    completed: false,
                    rows: []
                },
            ],
        },
        {
            page: 2,
            columns: [
                {
                    name: '6',
                    completed: false,
                    rows: []
                },
                {
                    name: '7',
                    completed: false,
                    rows: []
                },
                {
                    name: '8',
                    completed: false,
                    rows: []
                },
            ],
        },
    ]
}
export const RESTART_DATA_FOR_GROUP_S13_MEJIA = {
    name: 'Mejía',
    lastUpdatedDate: '',
    completed: false,
    pages: [
        {
            page: 1,
            columns: [
                {
                    name: '1',
                    completed: false,
                    rows: []
                },
                {
                    name: '2',
                    completed: false,
                    rows: []
                },
                {
                    name: '3',
                    completed: false,
                    rows: []
                },
                {
                    name: '4',
                    completed: false,
                    rows: []
                },
                {
                    name: '5',
                    completed: false,
                    rows: []
                },
            ],
        },
        {
            page: 2,
            columns: [
                {
                    name: '6',
                    completed: false,
                    rows: []
                },
                {
                    name: '7',
                    completed: false,
                    rows: []
                },
                {
                    name: '8',
                    completed: false,
                    rows: []
                },
                {
                    name: '9',
                    completed: false,
                    rows: []
                },
                {
                    name: '10',
                    completed: false,
                    rows: []
                }
            ],
        },
    ]
}
export const RESTART_DATA_FOR_GROUP_S13_VILLAREAL = {
    name: 'Villareal',
    lastUpdatedDate: '',
    completed: false,
    pages: [
        {
            page: 1,
            columns: [
                {
                    name: '1',
                    completed: false,
                    rows: []
                },
                {
                    name: '2',
                    completed: false,
                    rows: []
                },
                {
                    name: '3',
                    completed: false,
                    rows: []
                },
                {
                    name: '4',
                    completed: false,
                    rows: []
                },
                {
                    name: '5',
                    completed: false,
                    rows: []
                },
            ],
        },
        {
            page: 2,
            columns: [
                {
                    name: '6',
                    completed: false,
                    rows: []
                },
                {
                    name: '7',
                    completed: false,
                    rows: []
                },
                {
                    name: '8',
                    completed: false,
                    rows: []
                },
                {
                    name: '9',
                    completed: false,
                    rows: []
                },
                {
                    name: '10',
                    completed: false,
                    rows: []
                },
            ],
        },
    ]
}
export const RESTART_DATA_FOR_GROUP_S13_ECHEVERRIA = {
    name: 'Echeverría',
    lastUpdatedDate: '',
    completed: false,
    pages: [
        {
            page: 1,
            columns: [
                {
                    name: '1',
                    completed: false,
                    rows: []
                },
                {
                    name: '2',
                    completed: false,
                    rows: []
                },
                {
                    name: '3',
                    completed: false,
                    rows: []
                },
                {
                    name: '4',
                    completed: false,
                    rows: []
                },
                {
                    name: '5',
                    completed: false,
                    rows: []
                },
            ],
        },
        {
            page: 2,
            columns: [
                {
                    name: '6',
                    completed: false,
                    rows: []
                }
            ],
        },
    ]
}
export const RESTART_DATA_FOR_GROUP_S13_JARA = {
    name: 'Jara',
    lastUpdatedDate: '',
    completed: false,
    pages: [
        {
            page: 1,
            columns: [
                {
                    name: '1',
                    completed: false,
                    rows: []
                },
                {
                    name: '2',
                    completed: false,
                    rows: []
                },
                {
                    name: '3',
                    completed: false,
                    rows: []
                },
                {
                    name: '4',
                    completed: false,
                    rows: []
                },
                {
                    name: '5',
                    completed: false,
                    rows: []
                },
            ],
        },
        {
            page: 2,
            columns: [
                {
                    name: '6',
                    completed: false,
                    rows: []
                },
                {
                    name: '7',
                    completed: false,
                    rows: []
                },
            ],
        },
    ]
}

export const posicionPaginaUno = {
    columns: {
        one: {
            name: '1',
            params:{x: 50, y: 675, size: 10},
            a: {x: 60, y: 700, size: 10},
            b: {x: 60, y: 686, size: 10},
            c: {x: 110, y: 686, size: 10},
        },
        two: {
            name: '2',
            params:{x: 50, y: 645, size: 10},
            a: {x: 170, y: 700, size: 10},
            b: {x: 168, y: 686, size: 10},
            c: {x: 220, y: 686, size: 10},
        },
        three: {
            name: '3',
            params:{x: 50, y: 615, size: 10},
            a: {x: 280, y: 700, size: 10},
            b: {x: 278, y: 686, size: 10},
            c: {x: 330, y: 686, size: 10},
        },
        four: {
            name: '4',
            params:{x: 50, y: 585, size: 10},
            a: {x: 390, y: 700, size: 10},
            b: {x: 386, y: 686, size: 10},
            c: {x: 440, y: 686, size: 10},
        },
        five: {
            name: '5',
            params:{x: 50, y: 555, size: 10},
            a: {x: 500, y: 700, size: 10},
            b: {x: 494, y: 686, size: 10},
            c: {x: 550, y: 686, size: 10},
            
        },
        six: {
            name: '6',
            params:{x: 50, y: 525, size: 10},
            a: {x: 60, y: 700, size: 10},
            b: {x: 60, y: 686, size: 10},
            c: {x: 110, y: 686, size: 10},
        },
        seven: {
            name: '7',
            params: {x: 50, y: 495, size: 10},
            a: {x: 60, y: 700, size: 10},
            b: {x: 60, y: 686, size: 10},
            c: {x: 110, y: 686, size: 10},
        },
        eight: {
            name: '8',
            params:{x: 50, y: 465, size: 10},
            a: {x: 60, y: 700, size: 10},
            b: {x: 60, y: 686, size: 10},
            c: {x: 110, y: 686, size: 10},
        },
        nine: {
            name: '9',
            params:{x: 50, y: 435, size: 10},
            a: {x: 60, y: 700, size: 10},
            b: {x: 60, y: 686, size: 10},
            c: {x: 110, y: 686, size: 10},
        },
        ten: {
            name: '10',
            params:{x: 50, y: 405, size: 10},
            a: {x: 60, y: 700, size: 10},
            b: {x: 60, y: 686, size: 10},
            c: {x: 110, y: 686, size: 10},
        }
    }
}

export const posicionPaginaDos = {
    columns: {
        six: {
            name: '6',
            params:{x: 68, y: 720, size: 10},
            a: {x: 60, y: 700, size: 10},
            b: {x: 60, y: 686, size: 10},
            c: {x: 110, y: 686, size: 10},
        },
        seven: {
            name: '7',
            params: {x: 178, y: 720, size: 10},
            a: {x: 60, y: 700, size: 10},
            b: {x: 60, y: 686, size: 10},
            c: {x: 110, y: 686, size: 10},
        },
        eight: {
            name: '8',
            params:{x: 285, y: 720, size: 10},
            a: {x: 60, y: 700, size: 10},
            b: {x: 60, y: 686, size: 10},
            c: {x: 110, y: 686, size: 10},
        },
        nine: {
            name: '9',
            params:{x: 395, y: 720, size: 10},
            a: {x: 60, y: 700, size: 10},
            b: {x: 60, y: 686, size: 10},
            c: {x: 110, y: 686, size: 10},
        },
        ten: {
            name: '10',
            params:{x: 500, y: 720, size: 10},
            a: {x: 60, y: 700, size: 10},
            b: {x: 60, y: 686, size: 10},
            c: {x: 110, y: 686, size: 10},
        }
    }
}