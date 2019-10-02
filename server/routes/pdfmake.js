const express = require('express');
const app = express();

const pdfMake = require('../../pdfmake/pdfmake');
const vfsFonts = require('../../pdfmake/vfs_fonts');

const Institucion = require('../models/institucion')
const InstitucionRutas = require('../routes/institucion')

pdfMake.vfs = vfsFonts.pdfMake.vfs;

app.post('/pdf/planeacion', (req, res, next) => {
    //res.send('PDF');
    let body = req.body
    var fecha = { text: 'FECHA:', margin: [35, 20, 0, 0], style: 'tableHeader' }

    var documentDefinition = {
        content: [{
                style: 'titulo',
                table: {
                    heights: [50],
                    widths: [500],
                    body: [
                        [{ text: 'PLAN DE AUDITORIA PARA EL SGI DEL G3', margin: [10, 15, 10, 10], alignment: 'center' }]
                    ]
                }
                /*  stack: [
                      'PLAN DE AUDITORIA PARA EL SGI DEL G3',
                  ], 
                  style: 'header' */
            },
            {
                style: 'tableExample',
                color: '#444',
                table: {
                    widths: [140, 220, 38, 50],
                    body: [
                        [{ text: 'Instituto Tecnologico Superior:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: body.institucion, colSpan: 3, style: 'tableHeader', alignment: 'center' }, ' ', ' '],
                        [{ text: 'Norma de Referencia:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', colSpan: 3, style: 'tableHeader', alignment: 'center' }, ' ', ' '],
                        [{ text: 'Domicilio:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, ' ', { text: 'Idioma:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'Español', fontSize: 10, colSpan: 1, style: 'tableHeader', alignment: 'center' }],
                        [{ text: 'Objetivo:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', colSpan: 1, style: 'tableHeader', alignment: 'center' }, { text: 'NACE:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: '37', fontSize: 10, colSpan: 1, style: 'tableHeader', alignment: 'center' }],
                        [{ text: 'Alcance:', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: ' ', colSpan: 3, style: 'tableHeader', alignment: 'center' }, ' ', ' '],
                    ]
                }
            },
            fecha,
            { fecha },
            { fecha },
            // { text: 'FECHA:', margin: [35, 20, 0, 0], style: 'tableHeader' },
            {
                style: 'tableExample', // optional
                table: {
                    widths: [50, 'auto', 'auto', 'auto', 'auto'],
                    body: [
                        [{ text: 'HORARIO', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'PROCESO / ACTIVIDAD-REQUISITO / CRITERIO', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'PARTICIPANTES', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'CONTACTO', fontSize: 10, alignment: 'center', colSpan: 1, style: 'tableHeader' }, { text: 'ÁREA / SITIO', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }],
                        [' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' '],
                    ]
                }
            },
            { text: 'FECHA:', margin: [35, 20, 0, 0], style: 'tableHeader' },
            {
                style: 'tableExample', // optional
                table: {
                    widths: [50, 'auto', 'auto', 'auto', 'auto'],
                    body: [
                        [{ text: 'HORARIO', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'PROCESO / ACTIVIDAD-REQUISITO / CRITERIO', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'PARTICIPANTES', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }, { text: 'CONTACTO', fontSize: 10, alignment: 'center', colSpan: 1, style: 'tableHeader' }, { text: 'ÁREA / SITIO', alignment: 'center', fontSize: 10, colSpan: 1, style: 'tableHeader' }],
                        [' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' '],
                    ]
                }
            },
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

                fontSize: 20,
                margin: [5, 5, 5, 25]
            },
            firma: {
                margin: [170, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                color: 'black'
            }
        }
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data) => {
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment;filename="filename.pdf"'
        });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download);
    });

});


module.exports = app;