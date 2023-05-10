 //Funcion para buscar los datos del usuario por nit

  function finduser(){
    
    let nit= document.getElementById('nit').value;
   // document.getElementById('users').innerHTML='';
    fetch('/rotulos/finduser/'+ nit)
    
    .then(res => res.json())
    .then(res => {
        if (res[0]==0){
            console.log('Datos no encontrados')
            alert('Datos de usuario no encontrados!!')
        } else

        for(let data of res){
            console.log(res)
            
            document.getElementById('name').value=data.name
            document.getElementById('nitFound').value=data.identification
            document.getElementById('telefono').value=data.phonePrimary
            document.getElementById('telefono2').value=data.mobile
            document.getElementById('direccion').value=data.address.address
            document.getElementById('ciudad').value=data.address.city + '-' + data.address.department
            document.getElementById('correo').value=data.email
            
       // document.getElementById('users').innerHTML+= "<tr> <td style='text-transform:capitalize;'>"+(data.name)  + "</td>  <td> "+ (data.identification) +"</td>  <td> "+ (data.address.address)+ "</td> <td> "+(data.address.city)+ " </td> <td>  <button type='button' onclick='sendData("+(data.id)+")' > <img src='..\\img\\print.jpg' alt='' height ='30' width='30' /> </button> </td> </tr> "
        }
    })
    
    .catch( err => console.error(err));
    
    
}

function sendData(id){
     let textoLargo='';
     textoLargo= document.getElementById('notaBussi').value;
     let dataBack={id,textoLargo};
     dataBack= JSON.stringify(dataBack)
    
     fetch("rotulos/print",{
        method:'POST',
        headers:{
            "content-Type":"application/json",
        },
        body: JSON.stringify({id, textoLargo})
     })
     .then(response => response.json())
     .then(data => {
      
    console.log(data.name);
    window.open('rotulos/print/');
})
.catch(error => {
   
    console.error(error);
});

}