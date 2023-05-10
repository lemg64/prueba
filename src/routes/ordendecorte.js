const { query } = require('express');
const express = require('express');
const { prependOnceListener } = require('../database');
const router= express.Router();
const pool = require ('../database');
const { isloggedIn } = require('../lib/auth');

function is_json(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

router.get('/add', isloggedIn, async(req, res) => {
    const cortadores = await pool.query('SELECT * FROM responsables where idTipo = 3');
     const satelites = await pool.query('SELECT * FROM responsables where idTipo = 2'); 
      const productos = await pool.query('SELECT * FROM productosthd WHERE cortado!=1 ORDER BY id DESC');
     
   res.render('ordendecorte/add', {cortadores, satelites, productos}); 
  });

  router.post('/add',async(req,res)=> {
    const {listaArray, idCortador,valorCorte, idSatelite, idProducto, cantidadPrendas, cortado} =req.body;
     const newHead = {
      cortado,
      valorCorte,
      idProducto,
      idSatelite,
      cantidadPrendas
          };
          
     //actualizando consecutivo de orden de corte
     const ConsActual= await pool.query('SELECT ID FROM ordendecorte ORDER BY ID DESC LIMIT 1 FOR UPDATE');
      var consecutivoOc = ConsActual[0]
      if(consecutivoOc===undefined){
        console.log('Consecutivo OC no es un entero')
         consecutivoOc=1
        
      } else {
        consecutivoOc= parseInt(Object.values(JSON.parse(JSON.stringify(ConsActual[0]))))+1;
      }
      
       await pool.query ('INSERT INTO ordendecorte set ?', newHead);
       let Saldo= await pool.query('SELECT SUM(cantidadSalida) - SUM(cantidadEntrada) FROM kardex WHERE idProducto =? and idResponsable=?', [idProducto, idSatelite]);
        if (Saldo.length=0){
        Saldo= parseInt(Object.values(JSON.parse(JSON.stringify(Saldo[0])))) + parseInt(cantidadPrendas);
       } else{
        Saldo= parseInt(cantidadPrendas)
       }
       console.log('Nuevos saldo oC')
       console.log(Saldo);
       const TipoDoc='O.C';
      const newKardex= {
            id_Doc: consecutivoOc,
            idProducto,
            idResponsable: idSatelite,
            cantidadSalida: cantidadPrendas,
            TipoDoc,
            Saldo
                };
          await pool.query('INSERT INTO kardex SET ?', [newKardex]);
     
       //Llevar el movimiento al consolidado de telas para ir descontando del inventario del cortador
       console.log('Datos para extraer para el consolidado de telas')
           datosTela=[];
       listaArray.forEach(listaArray => {
        var {idTela, cantidadtela, nvoSaldo} = listaArray
       
         movTela = {
        idTela,
        cantidadCortada: cantidadtela,
        nvoSaldo,
        idOc:consecutivoOc,
        idCortador
       }
       datosTela.push(movTela);

       });   
       
       datosTela.forEach(async datosTela => {
        await pool.query('INSERT INTO consolidadotelas SET ?',[datosTela]);        
       });
            
       
     listaArray.forEach(listaArray => {
      listaArray.idOc=consecutivoOc;      
      listaArray.idCortador=idCortador;
      delete listaArray.rowId;
      delete listaArray.tela;
      delete listaArray.nvoSaldo;     

      });
       //Cambiamos el estado del producto a cortado
      await pool.query('UPDATE productosthd SET cortado= 1 WHERE ID = ?',[newHead.idProducto]);
        listaArray.forEach(async listaArray => {          
            await pool.query('INSERT INTO   detalleordendecorte set ?', listaArray);
      });
                   
           consecutivo=JSON.stringify(consecutivoOc)
           res.send(consecutivo);
        });

        //Imprimir orden de corte
        router.get('/print/:consecutivo', isloggedIn, async (req,res)=>{
         var {consecutivo} = req.params
            const datosCorte = await pool.query('SELECT idProducto, idSatelite, cantidadPrendas, fecha FROM ORDENDECORTE WHERE id=?', [consecutivo]);
            const datosDetail = await pool.query('SELECT * FROM detalleordendecorte WHERE idOc=?',[consecutivo]);
           //var datosHeadOc= await pool.query('')
           //Datos del cortador
            const cortador= await pool.query('SELECT nombre, telefono FROM responsables WHERE id=?', [datosDetail[0].idCortador]);
            const nameCortador= cortador[0].nombre;
            const telefonoCortador= cortador[0].telefono;
            // Datos del satelite
            const satelite= await pool.query('SELECT nombre, telefono FROM responsables WHERE id=?', [datosCorte[0].idSatelite]);
            const nameSatelite= satelite[0].nombre;
            const telefonoSatelite= satelite[0].telefono;
            
             //Datos del producto
             const producto= await pool.query('SELECT nombre, referencia FROM productosthd WHERE id=?', [datosCorte[0].idProducto]);
            const nameProducto= producto[0].nombre;
            const referenciaProducto= producto[0].referencia;
            //fecha
             const fecha= datosCorte[0].fecha;
             
            //cantidad
            const cantidad= datosCorte[0].cantidadPrendas;

            //Deatelle de la orden de corte
             let i=0
            for( let detail of datosDetail ){                          
            let nameTela= await pool.query('SELECT nombre from telas where id=?', [detail.idTela])
            let totalCortado = await pool.query('SELECT SUM(cantidadTela) FROM detalleordendecorte WHERE idCortador=? AND  idTela=?',[detail.idCortador, detail.idTela]);
            let totalIngresado= await pool.query('SELECT SUM(cantidadIngresada) FROM consolidadotelas WHERE idCortador=? AND idTela=?', [detail.idCortador, detail.idTela]);
           

            datosDetail[i].nameTela=nameTela[0].nombre;
            datosDetail[i].totalCortado=parseInt(Object.values(JSON.parse(JSON.stringify(totalCortado[0]))));
            datosDetail[i].totalIngresado=parseInt(Object.values(JSON.parse(JSON.stringify(totalIngresado[0]))))

            i++;           
            };
            
          res.render('ordendecorte/print',{datosDetail, consecutivo, nameCortador, telefonoCortador, nameSatelite, telefonoSatelite, nameProducto, referenciaProducto, fecha, cantidad});

        });

router.get('/list', isloggedIn, async(req,res)=> {
 const listOrdenCorte =  await pool.query('SELECT * FROM  ordendecorte');
  res.render('ordendecorte/list', {listOrdenCorte});
});
        


module.exports = router; 