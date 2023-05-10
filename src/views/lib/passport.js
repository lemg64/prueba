const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool= require('../database');
const helpers = require('../lib/helpers')

passport.use('local.signin', new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback: true  
}, async(req, username, password, done)=>{
      var rows= await pool.query('SELECT * FROM users WHERE username=?',[username]);
       if (rows.length >0 ){
        //const dataUser= await pool.query('SELECT nombre, id, idTipo FROM responsables WHERE nit=?', [username]);
       // rows[0].nombre=dataUser[0].nombre;
       // rows[0].id=dataUser[0].id;
       // rows[0].idTipo=dataUser[0].idTipo;
        const user = rows[0];
        const validPassword= await helpers.matchPassword(password, user.password);
        await helpers.matchPassword(password, user.password);
         if (validPassword){
            done(null, user, req.flash('success','Bienvenido'))
         }else{
            done(null, false, req.flash('message','Contraseña incorrecta!!'));
         } 
      } else{
        return done(null, false, req.flash('message','Usuario no existe...'))
      }
}));

passport.use('local.signup', new LocalStrategy({
   usernameField: 'usuario',
   passwordField: 'password',
   passReqToCallback: true

}, async (req, username, password, done) =>{
    
    const newUser={
        username,
        password,
    }
       newUser.password= await helpers.encryptPassword(password);
 const result = await pool.query('INSERT  INTO users SET ?', [newUser]);
 newUser.id=result.insertId;
 return done(null, newUser);
})); 

  passport.serializeUser((user, done)=>{
   console.log('Mostrando en serializer')
   console.log(user.nombre)
    console.log(user)
     done(null, user.id, user.nombre);
      });

      passport.deserializeUser(async(id, done)=>{
      const rows= await pool.query('SELECT * FROM users WHERE id=?',[id])
       done(null,rows[0]);
       });




