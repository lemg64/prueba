const express = require('express');
const router = express.Router();
const passport=require('passport');
const { isloggedIn, isNotLoggedIn, isPermited } = require('../lib/auth');

router.get('/logout', function(req, res){
   req.session.destroy(function(err) {
     if(err) {
       console.log(err);
     } else {
       res.redirect('/');
     }
   });
 });

router.get('/signup', isloggedIn, isPermited, (req,res)=>{
   res.render('auth/signup');
});

router.get('/signin', isNotLoggedIn, (req,res)=>{
   res.render('auth/login');
});

 router.post('/signin', isNotLoggedIn, (req,res, next)=>{
      passport.authenticate('local.signin',{
          successRedirect:'/profile',
          failureRedirect:'/signin',
          failureFlash:true
     })(req, res, next);

 });

 router.post('/signup', passport.authenticate('local.signup', {
       successRedirect:'/profile',
       failureRedirect:'/signup',
       failureFlash:true
    }));  
 

router.get('/profile', isloggedIn, (req,res)=>{
   res.render('profiles/profileBodega');
});

router.get('/logout', isloggedIn, (req, res) => {
   req.logOut();
   res.redirect('/signin');
} )

module.exports = router;
