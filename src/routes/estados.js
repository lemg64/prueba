const express= require('express');
const router= express.Router();
const pool = require ('../database');
const { isloggedIn, isPermited } = require('../lib/auth');


router.get('/', isloggedIn, async (req,res)=>{
  
  datosForsateliteIn=[];
  datosForsateliteOut=[];
  datosFinales=[];
  let OdSatelites=0;
  
  const satelites  = await pool.query('SELECT id FROM salida');
  const entradas = await  pool.query('SELECT * FROM entrada');
  const ordenCorte = await pool.query('SELECT * FROM ordendecorte');
  const satelitesEntradas =await pool.query('SELECT * FROM kardex');
  const productos = await pool.query('SELECT fechaTerminacion, fechaRecibiCorte, productosthd.id, sateliteId, fecha, observProcces, descriProcces, estado, codProcces, fechaProccesApro, fechaEnvcorte, envTintoreria, recibidoTintoreria, terminacion, responsables.nombre, productosthd.nombre as Producto, fecha, productosthd.cortado, referencia, cantidadPrendas FROM productosthd  LEFT JOIN ordendecorte ON productosthd.id=idProducto and sateliteId=idSatelite LEFT JOIN responsables ON productosthd.sateliteId = responsables.id WHERE condicion="Nuevo"  ORDER BY responsables.nombre');
    console.log(productos)
   for(let prod of productos){
   let sumEntradas =await pool.query( "SELECT SUM(cantidadEntrada) as 'entradas' FROM kardex WHERE idResponsable=? AND idProducto=?",[prod.sateliteId, prod.id])
   let sumSalidas = await pool.query("SELECT SUM(cantidadSalida) AS 'salidas' FROM kardex WHERE TipoDoc= 'Salida' AND idResponsable=? AND idProducto=?", [prod.sateliteId, prod.id] )
   if (prod.fecha===null){

   }else{ 
    prod.fecha = new Date(prod.fecha).toLocaleDateString();
   }
   prod.totalSalidas=sumSalidas[0].salidas;
   prod.totalEntradas=sumEntradas[0].entradas;
   //console.log(a[0].salidas)
   }
        
      
  res.render('estados/saldos', {entradas, ordenCorte, satelitesEntradas, productos});
});

router.get('/orderbyref', isloggedIn, async (req,res)=>{
  
  datosForsateliteIn=[];
  datosForsateliteOut=[];
  datosFinales=[];
  let OdSatelites=0;
  
  const salidas  = await pool.query('SELECT * FROM salida');
  const entradas = await  pool.query('SELECT * FROM entrada');
  const ordenCorte = await pool.query('SELECT * FROM ordendecorte');
  const satelitesEntradas =await pool.query('SELECT * FROM kardex');
  const productos = await pool.query('SELECT  fechaTerminacion, fechaRecibiCorte, productosthd.id, sateliteId, observProcces, fecha, descriProcces, estado, codProcces, fechaProccesApro, fechaEnvcorte, envTintoreria, recibidoTintoreria, terminacion, ductosthd.id=idProducto and sateliteId=idSatelite LEFT JOIN responsables ON productosthd.sateliteId = responsables.id  ORDER BY productosthd.referencia DESC');

  for(let prod of productos){
    let sumEntradas =await pool.query( "SELECT SUM(cantidadEntrada) as 'entradas' FROM kardex WHERE idResponsable=? AND idProducto=?",[prod.sateliteId, prod.id])
    let sumSalidas = await pool.query("SELECT SUM(cantidadSalida) AS 'salidas' FROM kardex WHERE TipoDoc= 'Salida' AND idResponsable=? AND idProducto=?", [prod.sateliteId, prod.id] )
    if (prod.fecha===null){
 
    }else{ 
     prod.fecha = new Date(prod.fecha).toLocaleDateString();
    }
    prod.totalSalidas=sumSalidas[0].salidas;
    prod.totalEntradas=sumEntradas[0].entradas;
    //console.log(a[0].salidas)
    }
         
       
  res.render('estados/saldos', {entradas, ordenCorte, satelitesEntradas, productos});
});

//Generar la consulta personalizada de referencias por satelites
router.get('/resumen/:id/:sateliteId', isloggedIn, async(req,res)=>{
  const {id, sateliteId} = req.params;
  

res.send('Detalle de movimientos por satelite y por referencias'+ id +  sateliteId);

})

//logica edicion de estado de muestras
router.post('/muestras',async(req,res)=>{
  const {fecha, id, estado, codProcces, descriProcces, observProcces}= req.body;
  const newData = {
    fechaProccesApro:fecha, estado, codProcces, descriProcces, observProcces
  }

  
  await pool.query('UPDATE productosthd set ? WHERE id=?',[newData, parseInt(id)]);


  console.log('datos de Muestras')
  console.log(newData)
  req.flash('success', 'Datos Guardados Correctamente!');
  res.writeHead(302, { 'Location': './' });
    res.end();
  
})

router.post('/envTinto',async(req,res)=>{
  const {fecha, id, envTintoreria}= req.body;
  const newData = {
    fechaEnvcorte:fecha, envTintoreria
  }  
  await pool.query('UPDATE productosthd set ? WHERE id=?',[newData, parseInt(id)]);
   req.flash('success', 'Datos Guardados Correctamente!');
  res.writeHead(302, { 'Location': './' });
    res.end();
  
});

router.post('/recibiTinto',async(req,res)=>{
  const {fecha, id, recibidoTintoreria}= req.body;
  const newData = {
    fechaRecibiCorte:fecha, recibidoTintoreria
  }  
  await pool.query('UPDATE productosthd set ? WHERE id=?',[newData, parseInt(id)]);
   req.flash('success', 'Datos Guardados Correctamente!');
  res.writeHead(302, { 'Location': './' });
    res.end();
  
})

router.post('/terminacion',async(req,res)=>{
  const {fecha, id, terminacion}= req.body;
  const newData = {
    fechaTerminacion:fecha, terminacion
  }  
  await pool.query('UPDATE productosthd set ? WHERE id=?',[newData, parseInt(id)]);
   req.flash('success', 'Datos Guardados Correctamente!');
  res.writeHead(302, { 'Location': './' });
    res.end();
  
})

module.exports= router;