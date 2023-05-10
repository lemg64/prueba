  // Enviamos por POST el tipo de Usuario que necesitamos 

  // solicitamos el consectivo con get, funcion deshabilitada temporalmente, no se requiere
  /*
  var consecutivo = 0;
  function consN(url){
    console.log(url)
  fetch(url)
   .then(res => res.json())
   .then(data => {
    consecutivo = data
    
   });
  }; */
    var consectivo=0;
    var idNombre='';
    var idProductoCapturar=0;
    var cantbyRef =0;
    var saldoRef=0;

     window.onload= function(){
      posconsecutivo=document.getElementById('nE');
      nroCons= posconsecutivo.getAttribute('data-cons'); 
      consecutivo=parseInt(nroCons)

    }

    function tipoUser(value){
      document.getElementById('nombre').innerHTML="";
        nombres=[];
        id=[value];
         let url="/functions/tipouser";
           var idBackend = JSON.stringify(id);
        fetch(url, {
        method: "POST",
        headers: {
          'content-Type' : 'application/json',
              },         
      body: idBackend,
            } );        
      //Pedimos con GET los usuarios del tipo que solicitamos
         fetch("functions/tipouser")
         .then(response => response.json())
         .then(data=> {
           nombres = data;      
            nombreResponsables(nombres.tipoUser); 
             }         
         );         
         }; 
       

     // dibujamos en los options del select los datos de nombres que llegan del Backend Y DB
     function  nombreResponsables(nombres) {
       let i=0
       document.getElementById('nombre').innerHTML +="<option value=''> </option>";
       nombres.forEach((element, i) => {           
        document.getElementById('nombre').innerHTML +="<option value="+ nombres[i].id + " id='elem' name ='elem'>"+ nombres[i].nombre + '</option>'
        i++
       });      
       };    

      // Llenar la descripción según select de ref 
    function addDescripcion(value){
      document.getElementById('descripcion').value=value;     
}
    
  //Llenar el data table con JavaScript
    idR = 0
   function llenarDatos() {
         
    function DatosMovimiento(idR, referencia, id_Doc, idProducto, cantidad, saldo, descripcion, observaciones, nroDocRespaldo){
      this.idR=idR;
      this.referencia=referencia;
      this.id_Doc=id_Doc;
      this.idProducto=idProducto;
      this.cantidad=cantidad;
      this.saldo=saldoRef;
      this.descripcion=descripcion;
      this.observaciones=observaciones;
      this.nroDocRespaldo=nroDocRespaldo;
      }  
        
    var referenciaCapturar = document.getElementById('referencia');
        refSelected = referenciaCapturar.options[referenciaCapturar.selectedIndex].text;
        var id_Doccapturar = consecutivo;
         idProductoCapturar = parseInt(referenciaCapturar.options[referenciaCapturar.selectedIndex].id);    
        cantidadCapturar = parseInt(document.getElementById('cantidad').value);
        var saldoCapturar= saldoRef;
        var descripcionCapturar = document.getElementById('descripcion').value;
        var observacionesCapturar = document.getElementById('observaciones').value;
        var nroDocRespaldoCapturar =  document.getElementById('nrosalida').value;
        
        if (refSelected=='-Seleccione-' || !cantidadCapturar > 0){
          document.getElementById('txtValidador').innerHTML='*Por favor llenar los datos!';
          return;
          }

        idR++; // Variable de autoincremento para Id de cada fila de la tabla
         id= 'id'+ idR
    nuevosDatos = new DatosMovimiento(idR,  refSelected, id_Doccapturar, idProductoCapturar, cantidadCapturar, saldoCapturar, descripcionCapturar, observacionesCapturar, nroDocRespaldoCapturar);
        agregar();    
  };
       // Array con datos de la tabla
     var datosArray= [];

      function agregar(){
          
       datosArray.push(nuevosDatos);   
       document.getElementById('txtValidador').innerHTML='';    
        document.getElementById('dataTable').innerHTML += "<tbody><tr class='text-center' id='"+id+"'> <td>"+nuevosDatos.referencia+"</td><td>"+nuevosDatos.cantidad + "</td><td>"+nuevosDatos.saldo + "</td><td>"+nuevosDatos.descripcion+"</td><td>"+nuevosDatos.observaciones+"</td><td> <a type='button'  onclick='eliminar("+idR+")' label='Eliminar'> <img src='..\\img\\Img Eliminar.jpg' alt='Eliminar' height ='30' width='30' /></a> </td> </tr>  </tbody>";
          console.log(datosArray) 
        sumar();
           }
     
        
         // Eliminar una Row de la tabla
      function  eliminar(idR) {
                const index = datosArray.findIndex((element) => element.idR === idR);
             if (index !== -1) {
                datosArray.splice(index, 1);
                let ubiRow= document.getElementById("id"+idR);
                 ubiRow.remove();
                 sumar();           
                         }                 
                     };

         // Sumar La cantidad de unidades de la tabla
      function sumar (){ sumAll= datosArray.map(item => parseInt(item.cantidad)).reduce((prev, curr) => prev + curr, 0);
        document.getElementById('total').innerHTML= "<h3 style='color:blue' > Total: " + sumAll +"</h3>";
        
        
      };

       // Uso de Fetch con Post para enviar los datos al backend
       
       function sendBackend(url_save){  
        var typeDoc= null;
          idTipo = parseInt(document.getElementById('tipo').value);                  
        idNombre = parseInt(document.getElementById('nombre').value);
          if (datosArray.length==0 || ! idNombre > 0 ){
            alert('Por favor ingrese todos los datos!!');
            return;
          }
         var cantidad = sumAll;
         var datosBackend = {datosArray, idNombre, cantidad, idTipo};
         datosBackend = JSON.stringify(datosBackend);
       fetch(url_save, {
        method: "POST",
         headers: {
          "content-Type" : "application/json",
              },         
       body: datosBackend
      } )
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
         typeDoc=response
          });
        setTimeout( function() {window.open('./'+ typeDoc +'/print/'+ consecutivo, '_blank');
        window.location.reload();

       },100);
        
       };                     

       function prueba(){
        fetch("../functions/uno")
        .then(res => res.json())
        .then(data =>{             
        });
       }

function saldoRefSat(cantidad){

  idNombre = parseInt(document.getElementById('nombre').value);
  var referenciaCapturar = document.getElementById('referencia');
  refSelected = referenciaCapturar.options[referenciaCapturar.selectedIndex].text;
  idProductoCapturar=parseInt(referenciaCapturar.options[referenciaCapturar.selectedIndex].id);

  const posDoc= document.getElementById('labelCons');
  const typeDoc=resul= posDoc.getAttribute('data-doc');
  
  
  var datosBysaldo={idNombre,idProductoCapturar};
  datosBysaldo=JSON.stringify(datosBysaldo);

  fetch('../functions/saldobyref',{
    method: 'POST',
    headers: {
      "content-type":"application/json",
    },
    body:datosBysaldo
  })
  .then(res=>res.json())
  .catch(error=>(console.error('error:', error)))
  .then(response =>{ 

    cantbyRef=response;
    
    if(typeDoc=='entrada'){

    saldoRef= parseInt(cantbyRef)-parseInt(cantidad);
    console.log('es una entrada')
    } else {
      saldoRef= parseInt(cantbyRef)+ parseInt(cantidad);
      console.log('es una salida')
    }
    

    console.log(saldoRef)
    })
    
  console.log('Id Nombre'+ idNombre)
   console.log('Id Producto'+ idProductoCapturar)
}
      
