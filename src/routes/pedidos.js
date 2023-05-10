const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isloggedIn } = require('../lib/auth');
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const api = new WooCommerceRestApi({
  url: "https://www.thunderjeans.co",
  consumerKey: "ck_b6dbfa14b94ed98fa26538d6d7a12740ee25d503",
  consumerSecret: "cs_59207e2251b5cd45fbad9f93cd079024a1ec37f9",
  version: "wc/v3"
});

 //var pedidos=[];

router.get('/', isloggedIn, async (req, res) => {
  try {
    const response = await api.get('orders', {
      per_page: 20,
      orderby: 'date',
      order: 'desc',
      status: 'processing' 
    });

    const pedidos = response.data;
      
    res.render('pedidos/list2', { pedidos });
        
  } catch (error) {
    console.log('Query failure', error);
    res.render('error');
  }    
});




module.exports = router;