
const express = require('express');
const router = express.Router();
const sdk = require('api')('@alegraswagger-test/v1.0#6m2mmh38leehwlk0');


router.get('/', (req,res)=>{
    res.render('rotulos/find')
})

router.get('/finduser/:nit', (req, res)=>{
    const {nit}= req.params;
    let datos=[];
sdk.auth('disthd70@hotmail.com', '73ad6e1773f26cb284d5');
sdk.listContacts   ({order_direction: 'ASC', query: nit})
  .then(({ data }) => {
    if (data.length< 1) {
      console.log('datos no encontrados')
      datos[0]= 0;
      res.send(JSON.stringify(datos));
      console.log(data)
    } 
    console.log(data)
   res.send(data);
  })

  .catch(err => {
    console.log('user no found')
    req.flash('success', 'no encontrado')
  });


})
let dataRot='';
let notaCliente='';
router.post('/print', (req, res) => {
  const { id, textoLargo } = req.body;
  notaCliente=textoLargo
  const newData = {
    id,
    textoLargo
  }
  
  sdk.auth('disthd70@hotmail.com', '73ad6e1773f26cb284d5');
  sdk.contactsDetails({id: id})
    .then(({ data }) => {
      dataRot=data;
      res.send(data);
    })     
    .catch(err => console.error(err));  
});

router.get('/print', (req, res)=>{
  console.log('Datos del rotulo desde el backend')  
  
   res.render('rotulos/print', {dataRot,notaCliente});

});

module.exports= router; 