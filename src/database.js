const mysql= require('mysql');
const Connection = require('mysql/lib/Connection');
const {database}=require('./keys');
const {promisify}=require('util');

const pool= mysql.createPool(database);
pool.getConnection((err, connection)=> {

    if(err) {
        if(err.code==='PROTOCOL_CONNECTION_LOST'){
            console.error('La conexion con la base de datos se ha cerrado');
        }
        if (err.code=== 'ECONNREFUSED'){
             console.error('La conexión ha sido rechazada');
        }
    }
if (connection) connection.release();
console.log('Base de datos conectada 🚀🚀🚀');
return;
});

// Coversion de callbackas a promesas
pool.query=promisify(pool.query);

module.exports	= pool;