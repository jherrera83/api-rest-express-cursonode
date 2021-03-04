const inicioDebug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express = require('express');
const config = require('config');
//const logger = require('./logger');
const morgan = require('morgan');
const Joi = require('@hapi/joi');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

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

const usuarios = 
	[{id:1, nombre: 'julio'},
	{id:2, nombre: 'enrique'},
	{id:3, nombre: 'luca'}]

app.get('/', (req, res) => {
	res.send('conectando desde express.')	
});

app.get('/api/usuarios',(req, res)=> {	
	res.send(usuarios);
});

app.get('/api/usuarios/:id',(req, res)=> {
	let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
	if(!usuario) res.status(404).send('usuario not found');
	else res.send(usuario);
});

app.post('/api/usuarios', (req, res)=> {	
	const {error, value} = validarUsuario(req.body.nombre);
	if(!error){
		const usuario = {
			id: usuarios.length + 1,
			nombre: value.nombre
		};
		usuarios.push(usuario);
		res.send(usuario);
	}
	else{
		const mensaje = error.details[0].message;
		res.status(400).send(mensaje);
	}
});

app.put('/api/usuarios/:id',  (req, res)=> {	
	const usuario = existeUsuario(req.params.id);
	if(!usuario){
		res.status(404).send('usuario not found');
		return;
	}
	
	const {error, value} = validarUsuario(req.body.nombre);	
	if(error){
		const mensaje = error.details[0].message;
		res.status(400).send(mensaje);
		return;		
	}

	usuario.nombre = value.nombre;
	res.send(usuario);

});

app.delete('/api/usuarios/:id', (req, res)=> {
	const usuario = existeUsuario(req.params.id);
	if(!usuario){
		res.status(404).send('usuario not found');
		return;
	}

	const index = usuarios.indexOf(usuario);
	usuarios.splice(index, 1);
	
	res.send(usuario);

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Escuchando desde el puerto ${port}`);
});

function existeUsuario(id){	
	return (usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom){
	const schema = Joi.object({
		nombre: Joi.string().alphanum().min(3).max(30).required()
	});
	return schema.validate({nombre: nom});
}