
function filter(tipo){
    console.log(tipo)
let resultFilter = datosFilter.filter(item => item['Tipo User']===tipo)
document.getElementById('contentReport').innerHTML='';
resultFilter.forEach(element => {
    document.getElementById('contentReport').innerHTML+="<tr><td>" + element['Num Documento'] +"</td><td>" + element['TipoDoc'] +"</td><td>" + element['Tipo User'] +"</td><td >" + element['nombre'] +"</td><td>" + element['referencia'] +"</td><td>" + element['Nom Product'] +"</td><td>" + element['cantidadSalida'] +"</td><td>" + element['cantidadEntrada'] +"</td><td>" + element['Saldo'] +"</td></tr>";
});
};

function filterByName(nameFilter){
    console.log(nameFilter)
let resultFilter = datosFilter.filter(item => item['nombre']===nameFilter)
document.getElementById('contentReport').innerHTML='';
resultFilter.forEach(element => {
    document.getElementById('contentReport').innerHTML+="<tr><td>" + element['Num Documento'] +"</td><td>" + element['TipoDoc'] +"</td><td>" + element['Tipo User'] +"</td><td >" + element['nombre'] +"</td><td>" + element['referencia'] +"</td><td>" + element['Nom Product'] +"</td><td>" + element['cantidadSalida'] +"</td><td>" + element['cantidadEntrada'] +"</td><td>" + element['Saldo'] +"</td></tr>";
});
};

let datosFilter='';

function datos(){
    
    fetch('/reports/kardex/filter')
    .then(response=> response.json())
    .then(data=>{
        datosFilter = data;
        let UsersTypeMap = datosFilter.map(item=>{
            return [item['Tipo User'],item]
        });
      var TypeUserMapArr = new Map(UsersTypeMap); // Pares de clave y valor
       let unicosTypeUsers = [...TypeUserMapArr.values()]; // Conversión a un array
             
       unicosTypeUsers.forEach(element => {
        document.getElementById('btnFilter').innerHTML+='<button class="btn btn-outline-primary m-2" onclick="filter(\''+element['Tipo User']+'\')" >'+element['Tipo User']+'</button>'
       });
       
       
         });
                      
         
       
 
}