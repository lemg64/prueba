const Handlebars = require('handlebars');
const {format}= require('timeago.js');

const helpers={};  

//Saldo por referencia de cada satelite, Orden de corte + salidas - entradas
Handlebars.registerHelper('sumar', function(valor1, valor2, valor3) {
    if (valor1===null){
      valor1=0;
    }
    if (valor2===null)
    {
      valor2=0;
    }
    if (valor3===null){
      valor3=0;
    }
    return parseInt(valor1) + parseInt(valor2)-parseInt(valor3);
  });
  //Saldo por referencia de cada satelite, Orden de corte + salidas - entradas
Handlebars.registerHelper('sumarEYS', function(valor1, valor2) {
  return parseInt(valor1) - parseInt(valor2);
});

  //Saldo por referencia de cada satelite, salidas - entradas
Handlebars.registerHelper('sumarDoc', function(valor1, valor2) {
  return valor1 - valor2;
});

 // Calcular porcentaje de cantidad ingresada a bodega
  Handlebars.registerHelper('porcentaje', function(valor1, valor2, valor3) {
    if (valor1===null){
      return  'Sin cortar'
    } else {
    if (valor2===null)
    {
      valor2=0;
    }
    if (valor3===null){
      valor3=0;
    }
    var a= valor3-valor2;
    var b = a / valor1;
    return parseInt(b *100) + '%';
  }
  });

 

Handlebars.registerHelper('eq', function(a, b) {
  a=parseInt(a)
  b=parseInt(b)
  //console.log(user)
  console.log(b)
  return a == b;
});

  

Handlebars.registerHelper('startsWith', function(str, prefix) {
  console.log('Revisando prefijo')
  //console.log(prefix)
  return str.startsWith(prefix);
});


  