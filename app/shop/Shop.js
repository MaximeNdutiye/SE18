const mongoose = require('mongoose');  
const Schema = mongoose.Schema;

const LineItemSchema = new Schema({  
  name: String,
  value: Number
});

const OrderSchema = new Schema({  
  lineItems: [{ type: Schema.ObjectId, ref: 'LineItem' }],
  value: Number
});

const ProductSchema = new Schema({
  name: String,
  lineItems: [{ type: Schema.ObjectId, ref: 'LineItem' }],
  value: Number
});

const ShopSchema = new Schema({  
  name: String,
  owner: String,
  products: [{ type: Schema.ObjectId, ref: 'Product' }],
  orders: [{ type: Schema.ObjectId, ref: 'Order' }],
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