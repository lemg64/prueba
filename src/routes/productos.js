const express = require('express');
const router= express.Router();
const pool = require ('../database');


router.get('/add', async (req, res) => {
    const telas= await pool.query('SELECT * FROM telas');
     const categorias = await pool.query('SELECT * FROM categorias');
      const satelites = await pool.query('SELECT * FROM responsables WHERE idTipo=2')
    
    res.render('productos/add',{telas, categorias, satelites});
});

router.post('/add', async(req, res) => {
    const {nombre, categoriaId, telaId, referencia, precio, sateliteId, condicion }=req.body;
     const nomSatelite = await pool.query('SELECT nombre, precio FROM responsables WHERE id=?',[sateliteId])   
       const nombreSatelite= nomSatelite[0].nombre;
        const precioSatelite= nomSatelite[0].precio;
    const newproducto={
        nombre,
        categoriaId,
        telaId,
        referencia,
        precio,
        sateliteId,
        condicion
                 
    };
    await pool.query('INSERT INTO productosthd set ?', [newproducto]);
          
          req.flash('success', 'Producto Creado Correctamente!!!')
        res.redirect('./list');
});


router.get('/list', async(req,res) => {
  const productos= await pool.query('SELECT * FROM productosthd');
  res.render('productos/list',{productos});
});

router.get('/edit/:id', async (req, res)=>{
      const {id}= req.params;
      const producto = await pool.query('SELECT * FROM productosthd WHERE id=?',[id]);
      const categoriaId = producto[0].categoriaId;
      const categorias = await pool.query('SELECT * FROM categorias');
      const categoria = await pool.query('SELECT * FROM categorias WHERE id= ?',[categoriaId])
      const telaId=producto[0].telaId;
      const tela = await pool.query('SELECT * FROM TELAS WHERE ID=?', [telaId]);
      const telas = await pool.query('SELECT * FROM TELAS');
      res.render('productos/edit', {categoria:categoria[0], producto, categorias, tela:tela[0], telas})
      //console.log(categoria)
});

router.post('/edit/:id', async(req,res)=>{
 const {id}= req.params;
  datos=req.body;
  await pool.query('UPDATE productosthd SET ? WHERE id=?',[datos, id]);
  console.log('datos actualizados')
  req.flash('success', 'Producto Editado Correctamente!!!')
  res.redirect('../list');
});

router.get('/eliminar/:id', async (req,res)=>{
 const {id}=req.params;
  await pool.query('DELETE FROM productosthd WHERE id=?',[id]);
  req.flash('success', 'Prodcuto Eliminado Correctamente!!!');
  res.redirect('../list');
});

module.exports = router;
