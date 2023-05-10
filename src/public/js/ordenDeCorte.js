//Calcular el valor del corte

//autocompletado del select

function prueba(a){
  console.log('prueba input: ' + a)
}

var cantidad = 0;
function calcularTotal(){
   let precio = parseInt(document.getElementById('precio').value);
    cantidad = parseInt(document.getElementById('cantidad').value);
   let total = precio * cantidad;
    if (!total >= 1) {
        document.getElementById('vlrCorte').value='';
        calcMtrsCortados()
        return;
    }

    document.getElementById('vlrCorte').value=total;
    calcMtrsCortados()
     };

     function  cargarTelas(value){
      if (value==0){
        document.getElementById('tela').innerHTML="<option id=''>-Seleccione-</option>";
          return;
      }
      document.getElementById('tela').innerHTML="-Seleccione-";
     idCortador=[value];
     idCortador= JSON.stringify(idCortador)
      const urltelas= '/functions/telas'
       telas='';
        fetch(urltelas, {
          method : "POST",
          headers: {
            'content-Type':'application/json',
          },
          body: idCortador
        });
        fetch(urltelas)
        .then(res => res.json())
        .then(data => {
          telas=data;
          i=0;
          document.getElementById('tela').innerHTML+= "<option id='' placeholder='Nombre de la tela'></option>"
          telas.forEach(element => {
             var idactual= telas[i].idTela;
             if (i!==0){
             var idanterior= telas[i-1].idTela;
             }
            if( idactual !== idanterior){              
            document.getElementById('tela').innerHTML+= "<option id='"+telas[i].idTela+"' value='"+telas[i].saldoTela+"'>"+telas[i].nTela+"</option>"
           
            }
            i++
          });
          
        })
     };

function addprecio(value){
    var precio= value;
     document.getElementById('precio').value=precio;
    
        };
        
        function addDescripcion(a,){
          //Importantisimo con esta funcion y el atributo data, puedo cargar muchos datos en una etiqueta html para manipular luego, importantisimo
          var e = document.getElementById("referencia");
          var option= e.options[e.selectedIndex];
          var precio = option.getAttribute("data-value1");
          var nombreSatelite = option.getAttribute("data-value2");

          var p = document.getElementById('cantidad').getAttribute('data-prueba');

             console.log(parseInt(p)+5)
          document.getElementById('descripcion').value=a;     
    }

        function calcMtrsCortados(){
           var saldo=document.getElementById('saldo').value;
           var mtrsCortados = document.getElementById("mtrsCortados").value;
           var promedio = mtrsCortados/cantidad;
           var newSaldo = saldo-mtrsCortados;
           var newSaldopreciso = newSaldo.toPrecision(5)
            var promedioPreciso = promedio.toPrecision(4);
            document.getElementById('promedio').value = promedioPreciso;
            document.getElementById('nvoSaldo').value = newSaldopreciso;
            var telaCapturar = document.getElementById('tela');
            telaCapturar.options[telaCapturar.selectedIndex].value=newSaldopreciso;

            };

         function saldoTelas(){    
          saldoTela = document.getElementById("tela").value;
          document.getElementById('saldo').value=saldoTela
                                    
         }
           rowId=0;
          function agregarDatos(){


            function telasdelcorte(rowId, idTela, tela, cantidadtela, promedio, nvoSaldo, observaciones){
              this.rowId=rowId;
              this.idTela=idTela;
              this.tela=tela;
              this.cantidadtela=cantidadtela;
              this.promedio=promedio;
              this.nvoSaldo=nvoSaldo;
              this.observaciones=observaciones;
            }
            var cantPrendas = document.getElementById("cantidad").value
            var telaCapturar = document.getElementById('tela');
            var nombreSelec = telaCapturar.options[telaCapturar.selectedIndex].text;
            var idTelaCapturar = parseInt(telaCapturar.options[telaCapturar.selectedIndex].id);
            var cantidadCapturar = parseFloat(document.getElementById('mtrsCortados').value);
            var promedioCapturar = parseFloat(document.getElementById('promedio').value);
            var nvosaldoCapturar = parseFloat(document.getElementById('nvoSaldo').value);
            var observacionesCapturar = document.getElementById('observacionesTela').value;
            if (idTelaCapturar==0 || !cantidadCapturar >0 || !promedioCapturar ==Infinity || cantPrendas < 1){
              alert('Por favor llene todos los datos')
              
              return;
            }

        rowId++;
         id='id' + rowId;
            nuevosDatos= new telasdelcorte(rowId, idTelaCapturar, nombreSelec, cantidadCapturar, promedioCapturar, nvosaldoCapturar, observacionesCapturar)
            agregarlist();
                };
                      var listaArray=[];
                function agregarlist(){
                  listaArray.push(nuevosDatos);
                  document.getElementById('dataTable').innerHTML += "<tbody><tr class='text-center' id='"+id+"'> <td>"+nuevosDatos.tela+"</td><td>"+nuevosDatos.cantidadtela + "</td><td>"+nuevosDatos.promedio+"</td><td>"+nuevosDatos.nvoSaldo+"</td><td>"+nuevosDatos.observaciones+"</td><td> <a type='button'  onclick='eliminar("+rowId+")' label='Eliminar'> <img src='..\\img\\Img Eliminar.jpg' alt='Eliminar' height ='30' width='30' /></a> </td> </tr>  </tbody>";
         
                  

                };
                //Eliminar datos de la tabla
                function  eliminar(rowId) {
                  const index = listaArray.findIndex((element) => element.rowId === rowId);
               if (index !== -1) {
                  listaArray.splice(index, 1);
                  let ubiRow= document.getElementById("id"+rowId);
                   ubiRow.remove();
                              
                           }                 
                       };
                       var consecutivo=0;
                 function sendBackend(url_save){
                  largo()
                  if (tamañoarray<=0){
                    alert('Por favor ingrese datos de telas!');
                    return;
                  }
                  
                  idCortador= parseInt(document.getElementById('cortador').value);

                  var nombreCor = document.getElementById('cortador');
                  var nombreCortador= nombreCor.options[nombreCor.selectedIndex].text;
                  var nombre = document.getElementById('nombre');
                  var idSatelite = nombre.options[nombre.selectedIndex].id;
                  var nombreSatelite= nombre.options[nombre.selectedIndex].text;
                  var referenciaPro = document.getElementById('referencia');
                  var idProducto = referenciaPro.options[referenciaPro.selectedIndex].id; 
                  var referencia = referenciaPro.options[referenciaPro.selectedIndex].text;
                  var nombreProducto = document.getElementById('descripcion').value;
                  var cantidadPrendas =document.getElementById('cantidad').value;
                  var valorCorte = document.getElementById('vlrCorte').value;
                  const cortado=1;
                  datostobackend = {listaArray, idCortador, idSatelite, idProducto, cantidadPrendas, valorCorte, nombreSatelite, nombreCortador, cortado, referencia, nombreProducto}
                  datostobackend =JSON.stringify(datostobackend)
                  fetch(url_save, {
                    method: 'POST',
                     headers:{
                      'content-Type':'application/json',                    
                     },
                     body: datostobackend
                  })
                  .then(res=>res.json())
                  .catch(error=>console.error('Error:',error))
                  .then(response=>{
                     consecutivo = response
                    console.log('El consecutivo para imprimir es: ' + consecutivo)
                    consecutivo=JSON.parse(consecutivo)
                  })
                  setTimeout( function() {window.open('./print/'+ consecutivo, '_blank'); 
                  window.location.reload();
                  }, 100 );
                 }

                 function largo(){
                   tamañoarray=listaArray.length;
                  
                }

               