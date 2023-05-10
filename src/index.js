const express = require('express');
const { ExpressHandlebars } = require('express-handlebars');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const path= require('path');
const { hasSubscribers } = require('diagnostics_channel');
const flash= require('connect-flash');
const session= require('express-session')
const MySQLStore=require('express-mysql-session');
const {database}=require('./keys');
const passport=require('passport');



//Inicialización
const app = express();
require('./lib/passport');

// settings
app.set ('port', process.env.PORT || 4000 );
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');
 

//Middlewares -peticiones al servidor-
app.use(session({
    secret:'sistemInventary',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//variables globales
app.use((req, res, next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/entradas', require('./routes/entradas'));
app.use('/salidas', require('./routes/salidas'));
app.use('/ordendecorte', require('./routes/ordendecorte'));
app.use('/productos', require('./routes/productos'));
app.use('/functions', require('./routes/functions'));
app.use('/proveedores', require('./routes/proveedores'));
app.use('/categorias', require('./routes/categorias'));
app.use('/ingresotelas', require('./routes/ingresotelas'));
app.use('/telas', require('./routes/telas'));
app.use('/responsables', require('./routes/responsables'));
app.use('/estados', require('./routes/estados'));
app.use('/pedidos', require('./routes/pedidos'));
app.use('/changepassword', require('./routes/changePassword'));
app.use('/rotulos', require('./routes/rotulos'));
app.use('/reports', require('./routes/reports'));



//Public Files
app.use(express.static(path.join(__dirname, 'public')));

//Starting Server
app.listen(app.get('port'),() => {
 console.log('server on port 🔥🔥🔥', app.get('port'));
});
