const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const routes = require('./src/api/routes');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(fileUpload());

for(var i = 0; i < routes.length; i++){
    var r = routes[i];
    app.use(r.base, r.router);
}

app.listen(3000, err => {
    if (err) {
        console.error('Error al cargar el servidor', err);
        process.exit(1);
    }else{
        console.log('Aplicación corriendo!');
    }
});