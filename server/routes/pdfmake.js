const express = require('express');
const app = express();

const pdfMake = require('../../pdfmake/pdfmake');
const vfsFonts = require('../../pdfmake/vfs_fonts');

pdfMake.vfs = vfsFonts.pdfMake.vfs;

app.post('/pdf/planeacion', (req, res, next) => {
    //res.send('PDF');
    let body = req.body;
    var hora = "Mickey";

    var tablas = [];

    var arrBody = [
        [
            [{ text: 'HORARIO', fillColor: '#dddddd', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'PROCESO / ACTIVIDAD-REQUISITO / CRITERIO', fillColor: '#dddddd', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'PARTICIPANTES', fillColor: '#dddddd', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'CONTACTO', fillColor: '#dddddd', fontSize: 10, alignment: 'center', colSpan: 1, style: 'tableHeader' }, { text: 'ÁREA / SITIO', fillColor: '#dddddd', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }],
            [{ text: hora, fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }],
        ],
        [
            [{ text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }],
        ],
        [
            [{ text: 'HORARIO', fillColor: '#dddddd', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'PROCESO / ACTIVIDAD-REQUISITO / CRITERIO', fillColor: '#dddddd', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'PARTICIPANTES', fillColor: '#dddddd', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'CONTACTO', fillColor: '#dddddd', fontSize: 10, alignment: 'center', colSpan: 1, style: 'tableHeader' }, { text: 'ÁREA / SITIO', fillColor: '#dddddd', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }],
            [{ text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', fontSize: 10, colSpan: 1, style: 'tableHeader' }],
        ]
    ];

    //Ciclo para crear las fechas y tablas dependiendo de la planeacion
    for (let index = 0; index < 3; index++) {
        tablas.push({ text: 'FECHA:', margin: [35, 20, 0, 0], style: 'tableHeader' }, {
            style: 'tableExample',
            table: {
                widths: [50, 'auto', 'auto', 'auto', 'auto'],
                body: arrBody[index],

            }
        });
    }

    var documentDefinition = {
        content: [{
                style: 'titulo',
                table: {
                    heights: [50],
                    widths: [500],
                    body: [
                        [{ text: 'PLAN DE AUDITORIA PARA EL SGI DEL G3', color: 'gray', margin: [10, 15, 10, 10], alignment: 'center' }]
                    ]
                }
            },
            {
                style: 'tableExample',
                color: '#444',
                table: {
                    widths: [140, 220, 38, 50],
                    body: [
                        [{ text: 'Instituto Tecnologico Superior:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: body.institucion, colSpan: 3, style: 'tableHeader' }, ' ', ' '],
                        [{ text: 'Norma de Referencia:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: body.normasR, colSpan: 3, style: 'tableHeader' }, ' ', ' '],
                        [{ text: 'Domicilio:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: body.domicilio, fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'Idioma:', fontSize: 10, colSpan: 1, style: 'tableHeader', alignment: 'center' }, { text: 'Español', fontSize: 10, colSpan: 1, style: 'tableHeader', alignment: 'center' }],
                        [{ text: 'Objetivo:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: body.objetivo, colSpan: 1, style: 'tableHeader' }, { text: 'NACE:', fontSize: 10, colSpan: 1, style: 'tableHeader', alignment: 'center' }, { text: '37', fontSize: 10, colSpan: 1, style: 'tableHeader', alignment: 'center' }],
                        [{ text: 'Alcance:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: body.alcance, colSpan: 3, style: 'tableHeader' }, ' ', ' '],
                    ]
                }
            },
            tablas,
            {
                style: 'firma',
                table: {
                    widths: ['auto', 'auto', 'auto'],
                    headerRows: 1,
                    body: [
                        [' ', { text: ' ', fontSize: 10, alignment: 'center', colSpan: 1, style: 'tableHeader' }, ''],
                        [' ', { text: 'Nombre y Firma del l(a) Auditor (a)Lider', fontSize: 8, alignment: 'center', colSpan: 1 }, ''],
                    ]
                },
                layout: 'lightHorizontalLines'
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            tableExample: {
                bold: true,
                fontSize: 11,
                margin: [10, 5, 0, 15]
            },
            titulo: {
                bold: true,
                fontSize: 20,
                margin: [5, 5, 5, 25]
            },
            firma: {
                margin: [170, 20, 0, 15]
            },
            tableHeader: {
                bold: true,
                color: 'black'
            },
            tableHeader2: {
                bold: true,
                widths: [100, 220, 38, 50],
                color: 'black'
            }
        }
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data) => {
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment;filename="plan_auditoria.pdf"'
        });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download);
    });
});
module.exports = app;