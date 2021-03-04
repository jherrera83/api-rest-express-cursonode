const inicioDebug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const usuarios = require('./routes/usuarios');
const express = require('express');
const config = require('config');
//const logger = require('./logger');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/api/usuarios', usuarios);

//Configuracion de entornos
console.log('Aplicacion ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));

//uso de un middleware de tercero
if(app.get('env') === 'development'){
	app.use(morgan('tiny'));
	//console.log('morgan habilitado');
	inicioDebug('Morgan esta habilitado');
}

//trabajos con la BD
//dbDebug('conextando con la BD');

//app.use(logger);

// app.use(function(req, res, next) {
// 	console.log('autenticando....');
// 	next();
// });

app.get('/', (req, res) => {
	res.send('conectando desde express.')	
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Escuchando desde el puerto ${port}`);
});

