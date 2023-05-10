const express = require('express');
const router = express.Router();
const passport=require('passport');


router.get('/', (req,res)=>{

    res.render('auth/changepassword')

})

router.post('/',(req,res)=>{
    console.log('cambiando contraseña');
})





module.exports= router; 