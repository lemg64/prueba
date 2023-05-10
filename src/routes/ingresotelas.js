const express= require('express');
const router= express.Router();
const pool = require ('../database');
const { isloggedIn } = require('../lib/auth');

var cortador=0;
router.get('/', isloggedIn, async (req,res)=>{
    const agencias= await pool.query('SELECT * FROM proveedores');
     cortador = await pool.query('SELECT * FROM responsables WHERE idTipo=?',[3]);
    const tela = await pool.query('SELECT * FROM telas');
    
    res.render('ingresotelas/add', {agencias, cortador, tela});

});

router.post('/',  async (req,res)=>{
   const {datosArray}=req.body;
   const {idCortador, nroDoc, fecha, sumMtrs}=req.body;
   const datosHeader = {idCortador, nroDoc, fecha, sumMtrs};

   await pool.query('INSERT INTO ingresotelas set ?', [datosHeader]);

   const ConsActual= await pool.query('SELECT ID FROM ingresotelas ORDER BY ID DESC LIMIT 1 FOR UPDATE');
     const consecutivoActual = parseInt(Object.values(JSON.parse(JSON.stringify(ConsActual[0]))))

   datosArray.forEach(async datosArray => {
    datosArray.idCortador=idCortador;
    datosArray.idDoc=consecutivoActual;
    delete datosArray.nombreTela;
      
    await pool.query('INSERT INTO consolidadotelas set ?', [datosArray]);
  
   
   })
   
   //req.flash('success', 'Tela registrada Correctamente, al Cortador:')
   //res.send('../ingresotelas');
});

module.exports= router; 