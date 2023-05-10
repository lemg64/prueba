const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isloggedIn } = require('../lib/auth');


var consecutivo = 0;

//Se hace la petición Get al servidor para renderizar el form 
router.get('/', isloggedIn, async (req, res) => {
  Cons = await pool.query('SELECT ID FROM entrada ORDER BY ID DESC LIMIT 1 FOR UPDATE');
  consecutivo = Cons[0];
   console.log(Cons.length);
   if (!Cons.length>0){
    console.log('No hay entrada disponible!!')
    consecutivo = 1
   } else {
    console.log('si es un entero primer paso')
    consecutivo = parseInt(Object.values(JSON.parse(JSON.stringify(Cons[0])))) + 1;
  }

  const productos = await pool.query('SELECT * FROM productosthd order by referencia desc');
  const tipo = await pool.query('SELECT * FROM tipouser');

  res.render('entradas/add', { productos, consecutivo, tipo });
});

router.get("/cons", (req, res) => {
  res.send(JSON.stringify(consecutivo));
});

// Enviando datos de la entrada a la base de datos mysql
router.post('/add', async (req, res) => {
  const { idNombre, cantidad, idTipo } = req.body;
  const newdatos = {
    idNombre,
    cantidad,
  };
  //Actualizando consecutivo

  var ConsActual = await pool.query('SELECT ID FROM entrada ORDER BY ID DESC LIMIT 1 FOR UPDATE');
  console.log('Consecutivo Actual entradas')
  consecutivoActual = ConsActual[0];
  console.log(ConsActual)
  if (!ConsActual.length>0) {
    console.log('no es un Entero')
    consecutivoActual = 1
  } else {
    console.log('si es un entero')
    consecutivoActual = parseInt(Object.values(JSON.parse(JSON.stringify(ConsActual[0])))) + 1;
  }
  await pool.query('INSERT INTO entrada  set ?', newdatos);
  const { datosArray } = req.body;
  
  
  datosArray.forEach(datosArray => {
    datosArray.cantidadEntrada=datosArray.cantidad;
    datosArray.idResponsable = idNombre;
    datosArray.id_Doc = consecutivoActual;
    datosArray.TipoDoc = 'Entrada'

    delete datosArray.idR;
    delete datosArray.referencia;
    delete datosArray.cantidad;
  });
  console.log(datosArray)
  
  datosArray.forEach(async datosArray => { 
   await pool.query('INSERT INTO kardex SET ?', datosArray) 
  });
  let type = JSON.stringify('entradas')
  
  res.send(type);
});

router.get('/print/:consecutivo', isloggedIn, async (req, res) => {
  const { consecutivo } = req.params;
  const headPdf = await pool.query("SELECT entrada.cantidad, responsables.nombre as 'Nombre', tipouser.nombre AS 'Tipo', telefono, entrada.fecha " +
    "FROM entrada left JOIN responsables ON responsables.id = entrada.idNombre " +
    "Left JOIN  tipouser ON responsables.idtipo = tipouser.id " +
    "WHERE  entrada.id=?", [consecutivo]);

  var headPdfValidate = headPdf[0]
  if (headPdfValidate === undefined) {
    res.send('Número de entrada no encontrado!!')
  } else {

    const tablePdf = await pool.query("SELECT kardex.cantidadEntrada, kardex.saldo,  kardex.idResponsable, kardex.idProducto, productosthd.referencia, kardex.nroDocRespaldo, kardex.observaciones, kardex.totalEntradas, kardex.totalSalidas, " +
      "kardex.descripcion " +
      "FROM kardex INNER join " +
      "productosthd On kardex.idProducto = productosthd.id " +
      " WHERE TipoDoc='Entrada' AND id_Doc=? ", [consecutivo]);
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

    let cantidad = headPdf[0].cantidad;
    //console.log(tablePdf[0].idResponsable)

    let totalSalida = await pool.query('SELECT SUM(CANTIDAD) FROM salida WHERE idnombre=?', [tablePdf[0].idResponsable]);

    let totalSalidaF = parseInt(Object.values(JSON.parse(JSON.stringify(totalSalida[0]))))
    if (isNaN(totalSalidaF)) {
      totalSalidaF = 0;
    } else {
    }
    let totalEntrada = await pool.query('SELECT SUM(CANTIDAD) FROM entrada WHERE idnombre=?', [tablePdf[0].idResponsable]);
    let totalEntradaF = parseInt(Object.values(JSON.parse(JSON.stringify(totalEntrada[0]))))
    if (isNaN(totalEntradaF)) {
      totalEntradaF = 0;
    } else {
    }

    let totalOrdenCorte = await pool.query('SELECT sum(cantidadPrendas) FROM `ordendecorte` WHERE idSatelite= ?', [tablePdf[0].idResponsable])
    let totalOrdenCorteF = parseInt(Object.values(JSON.parse(JSON.stringify(totalOrdenCorte[0]))))
    if (isNaN(totalOrdenCorteF)) {
      totalOrdenCorteF = 0
    } else {
    }
    let totalGlobal = totalOrdenCorteF + totalSalidaF - totalEntradaF

    res.render('entradas/print', { headPdf, tablePdf, consecutivo, cantidad, totalGlobal });
  }
});


router.get('/list', isloggedIn, async (req, res) => {
  const listEntradas = await pool.query('SELECT * FROM entrada ORDER BY ID DESC');
  i=0;
  
  for (let nom of listEntradas){
   nombreLit =  await pool.query('SELECT * FROM responsables WHERE id=?', [nom.idNombre])
   nom.fecha = new Date(nom.fecha).toDateString();
   newFecha=nom.fecha
   nom.fecha= newFecha;
    
    nom.nombre=nombreLit[0].nombre;
    
    i++;
    console.log(nom)
  } 
  //console.log(listEntradas);
  const tipo = await pool.query('SELECT * FROM tipouser');
  res.render('entradas/list', { listEntradas, tipo })
 
});

//vista individual de entradas

router.get('/view/:id', isloggedIn, async (req,res)=>{
  const {id} = req.params;
  const headView = await pool.query("SELECT entrada.cantidad, responsables.nombre as 'Nombre', tipouser.nombre AS 'Tipo', telefono, entrada.fecha " +
    "FROM entrada left JOIN responsables ON responsables.id = entrada.idNombre " +
    "Left JOIN  tipouser ON responsables.idtipo = tipouser.id " +
    "WHERE  entrada.id=?", [id]);
   if (headView.length>0){
    headView[0].fechaLit= new Date(headView[0].fecha).toDateString();
   }
   const tableView = await pool.query("SELECT kardex.cantidadEntrada, kardex.saldo,  kardex.idResponsable, kardex.idProducto, productosthd.referencia, kardex.nroDocRespaldo, kardex.observaciones, kardex.totalEntradas, kardex.totalSalidas, " +
      "kardex.descripcion " +
      "FROM kardex INNER join " +
      "productosthd On kardex.idProducto = productosthd.id " +
      " WHERE TipoDoc='Entrada' AND id_Doc=? ", [id]);
      console.log(tableView)
  res.render('entradas/viewIn',{headView,tableView});
});

module.exports = router;