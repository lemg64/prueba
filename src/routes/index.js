const express= require('express');
const router= express.Router();
const { isloggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/', isNotLoggedIn, (req,res)=>{
    res.render('layouts/inicio');
})

module.exports= router; 