const  response  = require('express');
const express= require('express');
const { appendFile } = require('fs');
const router= express.Router();
const pool = require ('../database');
const sdkContactos = require('api')('@alegraswagger-test/v1.0#131l4423lcqosibr');

var name ='';
var address='';

router.get("/", (req,res) => {
res.send("esto es una función");
});



    //Funcion para hallar la cantidad de telas existentes
     router.post('/telas', (req,res)=>{
      arraySend=[];
       idCortador=req.body
    
        router.get('/telas', async (req,res)=>{
        const telasId = await pool.query('SELECT DISTINCT idTela FROM consolidadotelas WHERE idCortador = '+ idCortador)
         
        let i=0;
          for (const telas of telasId){
            
            nombreTelas = await pool.query('SELECT nombre FROM telas WHERE id=?', telas.idTela)
              var idTela=telas.idTela;
              totalIngresado = await pool.query('SELECT SUM(cantidadIngresada) FROM consolidadotelas WHERE idTela = ' + idTela + ' AND idCortador = ' + idCortador);
              totalCortado = await pool.query('SELECT SUM(cantidadtela) FROM detalleordendecorte WHERE idTela = ' + idTela + ' AND idCortador = ' + idCortador);
              totalcortado=parseFloat(Object.values(JSON.parse(JSON.stringify(totalCortado[0]))));
             
              var nTela= nombreTelas[0].nombre;
                   totalIngresado=parseFloat(Object.values(JSON.parse(JSON.stringify(totalIngresado[0]))));

                   saldoTela= totalIngresado;
                   if (totalcortado>=0){
                   saldoTela = totalIngresado-totalcortado;
                   i++
                    };       
                    saldoTela =saldoTela.toPrecision(6)
                datosSend = {idTela, nTela, saldoTela};
                
                  arraySend.push(datosSend)     
                  i++;           
                           }  
                res.send(JSON.stringify(arraySend))
      });
     });
    
         
    router.post('/tipouser', async(req,res)=> {
        id = req.body;         
       // Se trae con GET de la base de datos todos los Users con el tipo seleccionado
       router.get('/tipouser', async(req,res)=> {          
        const tipoUser= await pool.query('SELECT * FROM responsables WHERE idTipo = ?', id );
         const datos={tipoUser}
         console.log('Tipo user')
           res.send(datos);
           
             });
         
           });

           
        //Traer contactos de alegra Estado OK

        function traerContactos(){
        
       sdkContactos.auth('disthd70@hotmail.com', '73ad6e1773f26cb284d5');
        sdkContactos.listContacts({
          metadata: 'false',
          limit: '5',
          order_direction: 'ASC',
          identification: '1077442712'
        })
        .then(({ data }) => {
          name = data[0].name;
          address = data[0].address.address;
          console.log(data);
      })

        .catch(err => console.error(err));
    }

 //Funcion para Traer las facturas de alegra y sumar la cantidad total de cada una:

        function sumarTotalCantFact(a, b) {
        const sdk = require('api')('@alegraswagger-test/v1.0#jddtmlci60o68');
 
       var posInicial = a;
       var posFinal=b;

       let total = 0;
       for  (posInicial; posInicial < posFinal; posInicial++ ) {
  
        sdk.auth('disthd70@hotmail.com', '73ad6e1773f26cb284d5');
        sdk.getInvoices({ numberTemplate_fullNumber: posInicial})
          .then(({ data }) => {      
            total = 0;
            for (let i = 0; i < data[0].items.length; i++) {
                total += data[0].items[i].quantity;
                 }
            console.log(data[0].numberTemplate.fullNumber + ',' + total);
          })   
         .catch(err => console.error(err));
          }
        }

  //Traer sumatoria de cotizaciones creadas en alegra:

  function sumaTotalCotizaciones(c, d){
   const sdk = require('api')('@alegraswagger-test/v1.0#jddtmlci60o68');
   let inicio= c;
   let fin =d;
   let total=0;
    for(inicio; inicio<=fin; inicio++){
sdk.auth('disthd70@hotmail.com', '73ad6e1773f26cb284d5');
sdk.getEstimatesId({id: inicio})
    
  .then(({ data }) => {
   total=0;
    data.items.forEach(element => {
      total += parseInt(element.quantity);
    });
   console.log('Cot'+ data.id + ','+ total);
  })
  .catch(err => console.error(err));
    }
  }

  //traer datos de Interrapisimo
 function rastreoInter(){
  fetch('https://www.interrapidisimo.com/sigue-tu-envio/?guia=700092719373')
     .then((response)=>{
      console.log(response)
     })
   .catch(function(err){
     console.log('Datos no encontrados')
   })
  }
  const zlib = require('zlib');
  //Traer datos de Servientrega
  function rastreoServi(){
   fetch('https://mobile.servientrega.com/WebSitePortal/RastreoEnvioDetalle.html?Guia=915919990')
     .then((response)=>{
      
      console.log(response)

     })
   .catch(function(err){
     console.log('Datos no encontrados:', err)
   })
  }

  router.post('/saldobyref', async (req, res)=>{
    let totalSal, totalEnt;
   const {idNombre, idProductoCapturar }=req.body
     const sumSalidas= await pool.query("SELECT SUM(cantidadSalida) FROM kardex WHERE idProducto=? AND idResponsable=?",[idProductoCapturar, idNombre]);
           totalSal= (Object.values(JSON.parse(JSON.stringify(sumSalidas[0]))));
        // const sumOC= await pool.query("SELECT SUM(cantidadprendas) FROM ordendecorte WHERE idProducto=? AND idSatelite=?", [idProductoCapturar, idNombre]);
        //  totalOc= (Object.values(JSON.parse(JSON.stringify(sumOC[0]))));
     const sumEntradas= await pool.query("SELECT SUM(cantidadEntrada) FROM kardex WHERE idProducto=? AND idResponsable=?",[idProductoCapturar, idNombre]);
           totalEnt=(Object.values(JSON.parse(JSON.stringify(sumEntradas[0]))));
            
           
            var saldoTotal= totalSal-totalEnt;
            
          let  saldoTotalSend=JSON.stringify(saldoTotal)
    res.send(saldoTotalSend)
  })
  
  
module.exports= router;
