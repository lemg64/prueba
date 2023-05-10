const express = require('express');
const router= express.Router();
const pool = require ('../database');

router.get('/', async (req,res)=>{
  const tipo = await pool.query('SELECT * FROM tipouser');
  const satelites = await pool.query('SELECT * FROM responsables');
res.render('responsables/add', {tipo, satelites});
});

router.get('/list', async (req,res)=>{
   const satelites = await pool.query('SELECT * FROM responsables');
res.render('responsables/list', {satelites});
});


router.post('/', async (req,res)=>{
   const datosResponsables = req.body;
   await pool.query('INSERT INTO responsables SET ?',[datosResponsables]);
    console.log(datosResponsables);
    req.flash('success', 'Usuario Creado Correctamente!!')  
res.redirect('../responsables');   
});

router.get('/edit/:id', async (req,res)=>{
 const {id} = req.params;
 const tipo = await pool.query('SELECT * FROM tipouser');
 const satelites = await pool.query('SELECT * FROM responsables');
 const datosEdit = await pool.query('SELECT * FROM responsables WHERE id = ?', [id]);
 const idTipo = datosEdit[0].idTipo;
 const nombreTipo = await pool.query('SELECT id, nombre FROM tipouser WHERE id=?', [idTipo]);
 res.render('responsables/edit', {datosEdit:datosEdit[0], satelites, tipo, nombreTipo:nombreTipo[0]}); 
});

router.post('/edit/:id', async (req,res)=>{
  const {id} = req.params;
  const newDatos = req.body;
  await pool.query ('UPDATE responsables set ? WHERE id = ?', [newDatos, id]);
  console.log('Datos actualizados',newDatos, id);
  res.redirect('../');
});

router.get('/eliminar/:id', async (req,res)=>{
  const {id} = req.params;
  await pool.query('DELETE  FROM responsables WHERE id=?', [id]);
  res.redirect('../'); 
});

router.get('/addTipo', (req,res)=>{
  res.render('responsables/tipo');
});

router.post('/addTipo',async(req, res, done)=>{
  const datos = req.body;
    try {
   const  res =await pool.query('INSERT INTO tipouser SET ?', [datos]);
   console.log(res)
    req.flash('success', 'Tipo de Usuario creado correctamente..')
     } catch (error) {
    console.log('No se guardaron los datos, intente nuevamente');
    req.flash('message', 'No se guardaron los datos, intente nuevamente!!')
    res.redirect('/responsables/addTipo')
    console.log(error);
  };
  
 res.redirect('/responsables/addTipo')
});

module.exports = router;