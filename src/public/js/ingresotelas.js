
datosArray=[];
var sumMtrs=0;
function agregarDatos(){
    document.getElementById('txtValidador').innerHTML="";
    const tela= document.getElementById('nombreTela');
    const idTela = tela.options[tela.selectedIndex].id; 
    const nombreTela = tela.options[tela.selectedIndex].text;
    const cantidadIngresada = document.getElementById('cantidad').value;
    const observaciones= document.getElementById('observaciones').value;
    if(idTela==0 || cantidad<=0){
        document.getElementById('txtValidador').innerHTML="<h5>*Por favor llenar el dato del nombre de la tela y/o la cantidad!!</h5>";
        return;
    };
    datos={idTela, nombreTela, cantidadIngresada, observaciones};     
    datosArray.push(datos);
    llenarTabla();
};

//Select de atucompletado


function llenarTabla(){
    let i=0;
        document.getElementById('dataTable').innerHTML ='';
        document.getElementById('dataTable').innerHTML= '<thead class="text-center"> <tr> <th>Nombre Tela</th> <th>Cantidad (Mtrs)</th><th>Observaciones</th><th>Acciones</th></tr></thead>';
        datosArray.forEach(datosArray => {
        document.getElementById('dataTable').innerHTML += "<tr class='text-center'> <td>"+datosArray.nombreTela+"</td><td>"+datosArray.cantidadIngresada+"</td><td>"+datosArray.observaciones+"</td><td><a type='button'  onclick='eliminar("+i+")' label='Eliminar'> <img src='..\\img\\Img Eliminar.jpg' alt='Eliminar' height ='30' width='30' /></a></td></tr>";
         i++;
    });
    sumarMtrs();
};

function eliminar(i){
    i=parseInt(i);
    datosArray.splice(i,1);
    llenarTabla();
};

function sumarMtrs(){
    sumMtrs= datosArray.map(datosArray => parseFloat(datosArray.cantidadIngresada)).reduce((prev, curr) => prev + curr, 0);    
    document.getElementById('totalMetros').innerHTML="<h3> Total:  " + sumMtrs +"</h3>";
};


function saveBackend(){
    document.getElementById('txtValidadorHeader').innerHTML='';
    const tamaño=parseInt(datosArray.length);
    const cortador = document.getElementById('cortador');
    const idCortador = cortador.options[cortador.selectedIndex].id;
    const nroDoc = document.getElementById('documento').value;
    const fecha = document.getElementById('fecha').value;
    
    if(tamaño <=0){
     alert('Tabla de datos vacía...');
        return;
    };
    if(idCortador==0 || nroDoc <=0 || fecha==''){
        document.getElementById('txtValidadorHeader').innerHTML='<h5>*Por favor seLeccione un Cortador y agregue un número de documento y/o fecha!</h5>';
        return;
        
    };
    datos ={datosArray, idCortador, nroDoc, fecha, sumMtrs};

    datos= JSON.stringify(datos);
    fetch('ingresotelas/',{
        method: 'POST',
        headers: {
            "content-Type":"application/json",
        },
        body:datos,
    })
    location.href ="/ingresotelas";
    alert('Tela Ingresada Correctamente')
};
