const { Router } = require('express');
const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isloggedIn } = require('../lib/auth');


//Se hace la petición Get al servidor para renderizar el form 
router.get('/', isloggedIn, async (req, res) => {
  Cons = await pool.query('SELECT ID FROM salida ORDER BY ID DESC LIMIT 1 FOR UPDATE');
  consecutivo = Cons[0];
  if (consecutivo === undefined) {
    console.log('no es un Entero')
    consecutivo = 1
  } else {
    console.log('si es un entero')
    consecutivo = parseInt(Object.values(JSON.parse(JSON.stringify(Cons[0])))) + 1;
  }
  const productos = await pool.query('SELECT * FROM productosthd order by referencia desc');
  const tipo = await pool.query('SELECT * FROM tipouser');

  res.render('salidas/add', { productos, consecutivo, tipo });

});
router.get("/cons", (req, res) => {
  res.send(JSON.stringify(consecutivo));
});

// Enviando datos de la salida a la base de datos mysql
router.post('/add', async (req, res) => {
  const { idNombre, cantidad, idTipo } = req.body;
  const newdatos = {
    idNombre,
    cantidad,
  };
  //Actualizando consecutivo 
  var ConsActual = await pool.query('SELECT ID FROM salida ORDER BY ID DESC LIMIT 1 FOR UPDATE');
  consecutivoActual = ConsActual[0];
  if (consecutivoActual === undefined) {
    console.log('no es un Entero')
    consecutivoActual = 1
  } else {
    console.log('si es un entero')
    consecutivoActual = parseInt(Object.values(JSON.parse(JSON.stringify(ConsActual[0])))) + 1;
  }
  await pool.query('INSERT INTO salida  set ?', newdatos);
  const { datosArray } = req.body;

  datosArray.forEach(datosArray => {
    datosArray.cantidadSalida=datosArray.cantidad;
    datosArray.idResponsable = idNombre;
    datosArray.id_Doc = consecutivoActual;
    datosArray.TipoDoc = 'Salida'
    delete datosArray.idR;
    delete datosArray.referencia;
    delete datosArray.cantidad;
  });
  await datosArray.forEach(datosArray => { pool.query('INSERT INTO kardex SET ?', datosArray) });
    let type = JSON.stringify('salidas')
  res.send(type);
});

//Generamos la vista para imprimir el comprobante
router.get('/print/:consecutivo', isloggedIn, async (req, res) => {

  const { consecutivo } = req.params;


  const headPdf = await pool.query("SELECT salida.cantidad, responsables.nombre as 'Nombre', tipouser.nombre AS 'Tipo', telefono, salida.fecha " +
    "FROM salida left JOIN responsables ON responsables.id = salida.idNombre " +
    "Left JOIN  tipouser ON responsables.idtipo = tipouser.id " +
    "WHERE salida.id=?", [consecutivo]);
  console.log('Datos del head')
  console.log(headPdf)

  const tablePdf = await pool.query("SELECT kardex.cantidadSalida, kardex.saldo, kardex.idResponsable, kardex.idProducto, productosthd.referencia, kardex.nroDocRespaldo, kardex.observaciones, kardex.totalEntradas, kardex.totalSalidas, " +
    "kardex.descripcion " +
    "FROM kardex INNER join " +
    "productosthd On kardex.idProducto = productosthd.id " +
    " WHERE tipoDoc='Salida' AND id_Doc=?", [consecutivo]);
  let i = 0;
  //Cargar las ordenes de corte segun referencia y satelite
  ordenes = [];
  for (let Oc of tablePdf) {    // for of en vez de for in
    let cantidadCortada = await pool.query('SELECT cantidadPrendas FROM ordendecorte WHERE idProducto=? AND idSatelite=?', [Oc.idProducto, Oc.idResponsable]);
    if (!isNaN(cantidadCortada)) {
      //Si no existe orden de corte se le asigna un cero a la variable ordenCorte
      Oc.ordenCorte = 0;
    } else {
      //Si existe orden de corte se le asigna la cantidad cortada al array
      Oc.ordenCorte = parseInt(JSON.stringify(cantidadCortada[0].cantidadPrendas));
    };
  };
  console.log('Sateeeeeeeeeeeeeeeelite')
  let cantidad = headPdf[0].cantidad;
  let totalSalida = await pool.query('SELECT SUM(CANTIDAD) FROM salida WHERE idnombre=?', [tablePdf[0].idResponsable]);
  console.log('Satelite:' + tablePdf[0].idResponsable)
  console.log(tablePdf[0].idResponsable);
  let totalSalidaF = parseInt(Object.values(JSON.parse(JSON.stringify(totalSalida[0]))));
  if (isNaN(totalSalidaF)) {
    console.log('No hay Salida!!' + totalSalidaF);
    totalSalidaF = 0;
  } else {
    console.log('si hay Salida' + totalSalidaF)
    console.log(totalSalidaF)
  }

  let totalEntrada = await pool.query('SELECT SUM(CANTIDAD) FROM entrada WHERE idnombre=?', [tablePdf[0].idResponsable]);
  let totalEntradaF = parseInt(Object.values(JSON.parse(JSON.stringify(totalEntrada[0]))));

  if (isNaN(totalEntradaF)) {
    console.log('No hay Entrada!!' + totalEntradaF);
    totalEntradaF = 0;
  } else {
    console.log('si hay Entrada' + totalEntradaF);
    console.log(totalEntradaF);
  }

  let totalOrdenCorte = await pool.query('SELECT sum(cantidadPrendas) FROM `ordendecorte` WHERE idSatelite= ?', [tablePdf[0].idResponsable])
  let totalOrdenCorteF = parseInt(Object.values(JSON.parse(JSON.stringify(totalOrdenCorte[0]))));
  if (isNaN(totalOrdenCorteF)) {
    console.log('No hay Orden de corte!!' + totalOrdenCorteF);
    totalOrdenCorteF = 0;
  } else {
    console.log('si hay orden de corte' + totalOrdenCorteF);
    console.log(totalOrdenCorteF);
  }
  let totalGlobal = totalOrdenCorteF + totalSalidaF - totalEntradaF;
  res.render('salidas/print', { headPdf, tablePdf, consecutivo, cantidad, totalGlobal });
});


//lista de salidas
router.get('/list', isloggedIn, async (req, res) => {

  const listSalidas = await pool.query('SELECT * FROM  SALIDA ORDER BY ID DESC');
  
  i=0;
  
  for (let nom of listSalidas){
   nombreLit =  await pool.query('SELECT * FROM responsables WHERE id=?', [nom.idNombre])
   nom.fecha = new Date(nom.fecha).toDateString();
   newFecha=nom.fecha
   nom.fecha= newFecha;
    
    nom.nombre=nombreLit[0].nombre;
    
    i++;
    console.log(nom)
  } 
  
  const tipo = await pool.query('SELECT * FROM tipouser');
  
  res.render('salidas/list', { listSalidas, tipo });

});

//vista individual de salidas

router.get('/view/:id', isloggedIn, async (req,res)=>{
  const {id} = req.params;
  const headView = await pool.query("SELECT salida.cantidad, responsables.nombre as 'Nombre', tipouser.nombre AS 'Tipo', telefono, salida.fecha " +
    "FROM salida left JOIN responsables ON responsables.id = salida.idNombre " +
    "Left JOIN  tipouser ON responsables.idtipo = tipouser.id " +
    "WHERE  salida.id=?", [id]);
   if (headView.length>0){
    headView[0].fechaLit= new Date(headView[0].fecha).toDateString();
   }
   const tableView = await pool.query("SELECT kardex.cantidadSalida, kardex.saldo,  kardex.idResponsable, kardex.idProducto, productosthd.referencia, kardex.nroDocRespaldo, kardex.observaciones, kardex.totalEntradas, kardex.totalSalidas, " +
      "kardex.descripcion " +
      "FROM kardex INNER join " +
      "productosthd On kardex.idProducto = productosthd.id " +
      " WHERE TipoDoc='Salida' AND id_Doc=? ", [id]);
      console.log(tableView)
  res.render('salidas/viewOut',{headView,tableView});
});

module.exports = router;
