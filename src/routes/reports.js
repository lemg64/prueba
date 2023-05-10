const express = require('express');
const { isloggedIn } = require('../lib/auth');
const router = express.Router();
const pool = require('../database');

router.get('/', isloggedIn, (req,res)=>{
res.send('Modulo de reportes')
});

router.get('/kardex', isloggedIn, async(req,res)=>{
  
     let reportKardex = await pool.query("SELECT id_Doc as 'Num Documento', ID_De, TipoDoc, salida.fecha as 'Fecha', productosthd.nombre as 'Nom Product', cantidadSalida, cantidadEntrada, Saldo, referencia, tipouser.nombre as 'Tipo User', responsables.nombre  FROM `kardex` INNER JOIN responsables ON kardex.idResponsable= responsables.id INNER join tipouser ON responsables.idTipo = tipouser.id INNER JOIN productosthd On kardex.idProducto=productosthd.id INNER JOIN salida On kardex.id_Doc=salida.ID ORDER by ID_De")    

     const resultado = reportKardex.filter(item => item.TipoDoc === 'O.C');

    // console.log(reportKardex);

    res.render('reports/kardex', {reportKardex})
})

router.get('/general', isloggedIn, async(req,res)=>{
    var respuestas =[];
    let dataResultF=[];
    let usersDoc = await pool.query('SELECT DISTINCT idResponsable FROM `kardex`')
  
      for (const userId of usersDoc) {
        let dataResult= await pool.query("SELECT idResponsable, ID_De, tipouser.nombre as 'Tipo', SUM(cantidadSalida) as 'totalSalida', SUM(cantidadEntrada) as 'totalEntrada', SUM(cantidadSalida)- SUM(cantidadEntrada) as 'Saldo', responsables.nombre, idTipo FROM `kardex` INNER JOIN  responsables on kardex.idResponsable=responsables.id INNER JOIN  tipouser on tipouser.id = responsables.idTipo WHERE idResponsable=?",[userId.idResponsable])
             

        let kardexRes = await pool.query("SELECT id_Doc as 'NumDocumento' , kardex.idResponsable as 'id', TipoDoc, cantidadSalida, cantidadEntrada, Saldo, referencia, productosthd.nombre as 'nomProduct', tipouser.nombre as 'Tipo User', responsables.nombre FROM `kardex` LEFT JOIN responsables ON kardex.idResponsable= responsables.id LEFT join tipouser ON tipouser.id = responsables.id LEFT JOIN productosthd On kardex.idProducto=productosthd.id WHERE idResponsable=?",[userId.idResponsable]);
          let i=0;
        for (const iterator of kardexRes) {
            dataResult.push(kardexRes[i])
            i++;
        }
        dataResultF.push(dataResult)
        respuestas.push(dataResult[0]) 
        console.log(kardexRes);
               
      }

   // console.log(dataResultF);

   res.render('reports/general', {dataResultF})
})

router.get('/kardex/filter', isloggedIn, async(req,res)=>{
  
    let reportKardex = await pool.query("SELECT id_Doc as 'Num Documento' , TipoDoc, productosthd.nombre as 'Nom Product', cantidadSalida, cantidadEntrada, Saldo, referencia, tipouser.nombre as 'Tipo User', responsables.nombre  FROM `kardex` INNER JOIN responsables ON kardex.idResponsable= responsables.id INNER join tipouser ON responsables.idTipo = tipouser.id INNER JOIN productosthd On kardex.idProducto=productosthd.id")
    

    const resultado = reportKardex.filter(item => item.TipoDoc === 'O.C');

    
   let reportKardexF= JSON.stringify(reportKardex);
  //  console.log(reportKardex);
   res.send(reportKardexF)
})

module.exports=router;