const express= require('express');
const router= express.Router();
const pool = require ('../database');
const { isloggedIn } = require('../lib/auth');

router.get('/', isloggedIn, (req, res)=>{
res.render('categorias/add');

});

router.post('/',  async(req,res)=>{
   const datos=req.body;
    await pool.query('INSERT INTO  categorias SET ?',[datos]);
    req.flash('success', 'Categoría Creada')
    res.redirect('/categorias/list');
});

router.get('/list', isloggedIn, async (req,res)=>{
  const categorias = await pool.query('SELECT * FROM categorias');
    res.render('categorias/list', {categorias});
});

router.get('/edit/:id', isloggedIn, async(req,res)=>{
  const {id} = req.params;
  const categoriaEdit = await pool.query('SELECT * FROM categorias WHERE id = ?',[id]);
   res.render('categorias/edit',{categoria:categoriaEdit[0]});
});

router.post('/edit/:id',  async(req,res)=>{
  const {id} = req.params;
  const datos = req.body;
  await pool.query('UPDATE categorias set ? WHERE id=?',[datos, id]);
  res.redirect('../list');
});

router.get('/eliminar/:id', isloggedIn, async(req, res)=>{
 const {id} = req.params;
 await pool.query('DELETE FROM categorias WHERE id=?',[id]);
 res.redirect('../list');
});

module.exports= router; 