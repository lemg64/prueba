module.exports={

    isloggedIn(req,res, next){
        if(req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    },

    isNotLoggedIn(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/profile');
    },
    //Funcion para restringir rutas segun el rol
    isPermited(req, res, next){
        if(req.user.rol_Id===1){
            
            return next();
        }        
        req.flash('success', 'No tienes permiso para ejecutar esta tarea!')
        return res.redirect('/profile');
    }

}