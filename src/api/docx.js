const express = require('express');
const router = express.Router();
const parseDocx = require('../parseDocx');

router.post('/', function(req, res, next) {
    if (!req.files || Object.keys(req.files).length === 0) {
        let response = {'error':'No se enviaron archivos'};
        return res.status(400).send(response);
    }

    let files = req.files;
    let data = req.body;
    const bufferData = parseDocx.getBuffer(files.f.data, data);

    res.writeHead(200, {
        'Content-Type': files.f.mimetype,
        'Content-disposition': `attachment;filename=out_${files.f.name}`,
        'Content-Length': bufferData.length
    });

    res.end(Buffer.from(bufferData, 'binary'));
});

router.post('/tags', function(req, res, next) {
    if (!req.files || Object.keys(req.files).length === 0) {
        let response = {'error':'No se enviaron archivos'};
        return res.status(400).send(response);
    }

    let files = req.files;
    const tags = parseDocx.getTags(files.f.data);

    let response = {'tags': tags };
    return res.status(200).send(response);
});

router.get('/test', function(req, res, next) {
    const bufferData = parseDocx.getBuffer();

    res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-disposition': 'attachment;filename=docTest.docx',
        'Content-Length': bufferData.length
    });

    res.end(Buffer.from(bufferData, 'binary'));
});

module.exports = router;