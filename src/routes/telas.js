const express= require('express');
const router= express.Router();
const pool = require ('../database');


router.get('/', async (req,res)=>{
const proveedores = await pool.query('SELECT * FROM proveedores');

 res.render('telas/add', {proveedores});
});

router.post('/add', async (req,res)=>{
    const datos= req.body;
     await pool.query('INSERT INTO telas set ?', [datos]);
     req.flash('success', 'Tela Creada Correctamente!!!')
res.redirect('../telas/list');
});

router.get('/list', async (req,res)=>{
    const telas = await pool.query('SELECT * FROM telas')
    res.render('telas/list', {telas});
});

router.get('/eliminar/:id', async (req,res)=>{
const {id}= req.params;
await pool.query('DELETE FROM telas WHERE id=?', [id]);
req.flash('success', 'Tela Eliminada Correctamente!!!')
res.redirect('../list');
});

router.get('/edit/:id', async (req,res)=>{
    const {id}= req.params;
    const datoEdit = await pool.query('SELECT  * FROM telas WHERE id=?', [id]);
    const idProve = datoEdit[0].proveedorId;
    const proveedor = await pool.query('SELECT  id, nombre FROM proveedores WHERE id=?', [idProve]);
    const proveedores = await pool.query('SELECT * FROM proveedores');
    res.render('telas/edit', {datoEdit, proveedor: proveedor[0], proveedores } );
    });

router.post('/edit/:id', async (req,res)=>{
    const {id} = req.params;
    const datos= req.body;
    await pool.query('UPDATE telas SET ? WHERE id=?', [datos, id]);
    req.flash('success', 'Tela Editada Correctamente!!!')
    res.redirect('../list')
    
});



module.exports= router; 