var mongoose = require('mongoose');  

var LineItemSchema = new mongoose.Schema({  
  name: String,
  value: Number
});

var OrderSchema = new mongoose.Schema({  
  lineItems: [LineItemSchema],
  value: Number
});

var ProductSchema = new mongoose.Schema({
  name: String,
  lineItems: [LineItemSchema],
  value: Number
});

var ShopSchema = new mongoose.Schema({  
  name: String,
  owner: String,
  products: [ProductSchema],
  orders: [OrderSchema],
  created: { 
    type: Date,
    default: Date.now
  }
});

mongoose.model('LineItem', LineItemSchema);
mongoose.model('Order', OrderSchema);
mongoose.model('Product', ProductSchema);
mongoose.model('Shop', ShopSchema);

module.exports = {
  LineItem: mongoose.model('LineItem'),
  Order: mongoose.model('Order'),
  Product: mongoose.model('Product'),
  Shop: module.exports = mongoose.model('Shop')
}