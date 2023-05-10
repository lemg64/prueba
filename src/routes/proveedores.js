const express= require('express');
const router= express.Router();
const pool = require ('../database');

router.get('/', (req,res)=>{
res.render('proveedores/add')
});

router.post('/', async (req,res)=>{
   datos=req.body;
   await pool.query('INSERT INTO proveedores SET ? ', [datos]);
   req.flash('success', 'Proveedor creado correctamente!!!')
   res.redirect('/proveedores');
});

 router.get('/list', async (req,res)=>{
    const listproveedores= await pool.query('SELECT * FROM  proveedores order by nombre');
    res.render('proveedores/list', {listproveedores})
 });

 router.get('/eliminar/:id', async(req, res)=>{
    const{ id } =req.params;
   await pool.query('DELETE FROM proveedores WHERE id = ?', [id]);
   req.flash('success', 'Proveedor elimado correctamente!!!')
    res.redirect('../list');
 })

 router.get('/editar/:id', async(req, res)=>{
    const{ id } =req.params;
   const proveedor = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
   
   res.render('proveedores/edit', {proveedor: proveedor[0]});

 })
 router.post('/editar/:id', async(req,res)=>{
   var {id}= req.params;
   console.log('el id es: ', parseInt(id))
   const datoseditar = req.body;
   await pool.query('UPDATE proveedores set ? WHERE id=?', [datoseditar, parseInt(id)])
   req.flash('success', 'Proveedor editado correctamente!!!')
   res.redirect('../list')

 });

module.exports= router; 