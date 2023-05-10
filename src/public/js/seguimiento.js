
// Logica para marcar los botones de acuerdo al estado de la producción

function load(id, estado, prueba){
                console.log('Iniciando Update!!', estado, prueba*2)
        if (estado==1){
                document.getElementById('btnCor'+id+estado).innerHTML="74%";
                document.getElementById('btnCor'+id+estado).className = "btn-bg-green m-2 col-md-12";
        } else {
                document.getElementById('btnCor'+id).innerHTML="99%";
                document.getElementById('btnCor'+id).className = "btn-bg-red m-2 col-md-12";
        }

        
       
        
 };

 
 function TintoEnv(id){    
    document.getElementById('btnTinE'+id).innerHTML="SI";
     document.getElementById('btnTinE'+id).className = "btn btn-success m-2 col-md-12";
};

