/*
* @autho Maxime Ndutiye
* A simple NodeJs API
*/
const express = require('express');
const app = express();

const ShopController = require('./shop/ShopController');
const ProductController = require('./shop/ProductController');
const OrderController = require('./shop/OrderController');
const LineItemController = require('./shop/LineItemController');

app.use('/shops', ShopController);
app.use('/products', ProductController);
app.use('/orders', OrderController);
app.use('/lineitems', LineItemController);

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.method === 'Options') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
    return res.status(200).json({});
  }
});

module.exports = app;