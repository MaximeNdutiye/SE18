const express = require('express');
const bodyParser = require('body-parser');
const Schema = require('./Shop');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', function (req, res) {
    let newShop = new Schema.Shop({
            name : req.body.name,
            owner : req.body.owner,
            products: [],
            orders: []});

    updateShopAttributes(req, newShop, true); 

    newShop.save();
    res.status(200).send({data: newShop});
});

router.get('/', function (req, res) {
    Schema.Shop.find({})
    .exec((err, data) => {
        console.log(err);
        console.log(data);
        res.status(200).send("oook");
    });

   /* Schema.Shop
        .find({})
        .populate([
            {
                path:'products',		
    	        populate: {
    	            path:  'lineItems',
    		        model: 'LineItem' }
                
            },
		    {
	        path:'orders',		
	            populate: {
    	            path:  'lineItems',
    		        model: 'LineItem' }
		    }
        ])
        .exec(function (err, stores) {
            if (err) return res.status(500).send({err: err});
            console.log('resufdsafds');
            res.status(200).send({stores: stores});
        });*/
});

router.get('/:id', function (req, res) {
    Schema.Shop
        .findById(req.params.id)
        .populate([
            {
                path:'products',		
    	        populate: {
    	            path:  'lineItems',
    		        model: 'LineItem' }
            },
		    {
		        path:'orders',		
	            populate: {
    	            path:  'lineItems',
    		        model: 'LineItem' }
		    }
        ])
        .exec(function (err, store) {
            if (err) return res.status(500).send({err: err});
            res.status(200).send({store: store});
        });
});

router.get('/:id/products', function (req, res) {
    Schema.Shop
      .findById(req.params.id)
      .select({'products': 1})
      .populate({
          path: 'products',
          populate: {
              path: 'lineItems',
              model: 'LineItem'
          }
      })
      .exec(function (err, products) {
            if (err) return res.status(500).send({err: err});
            res.status(200).send(products);
        });
});

router.get('/:id/orders', function (req, res) {
    Schema.Shop
      .findById(req.params.id)
      .select({'orders': 1})
      .populate({
          path: 'orders',
          populate: {
              path: 'lineItems',
              model: 'LineItem'
          }
      })
      .exec(function (err, orders) {
            if (err) return res.status(500).send({err: err});
            res.status(200).send(orders);
        });
});

router.delete('/:id', function (req, res) {
    Schema.Shop.findByIdAndRemove(req.params.id, function (err, removedShop) {
        if (err) return res.status(500).send({err: err});
        if (!removedShop) return res.status(200).send({msg: 'no shop found'});

        removedShop.products.forEach(product => {
            Schema.Product.findByIdAndRemove(product._id, function(err, removedProduct) {
                if (err) return res.status(500).send({err: err});
                removedProduct.lineItems.forEach(lineItem => {
                    Schema.LineItem.findByIdAndRemove(lineItem._id, (err, removedItem) => {
                        if (err) return res.status(500).send({err: err});
                    });
                });
            });
        });
        res.status(200).send({msg: "Shop " + removedShop.name + " was deleted along with all accompanying data."});
    });
});

router.put('/:id', function (req, res) {
    Schema.Shop.findById(req.params.id, function (err, shop) {
        if (err) return res.status(500).send({err: err});
        if (!shop) return res.status(200).send({msg: 'no shop found'});

        updateShopAttributes(req, shop, false);

        shop.save(function (err, updatedShop) {
            if (err) return res.status(500).send({err: err});
            res.status(200).send({data: updatedShop});
        });
    });
});

function updateShopAttributes(req, shop, reset){
    let products = req.body.products ? JSON.parse(req.body.products) : null;
    let orders =  req.body.orders ? JSON.parse(req.body.orders) : null;

    if (req.body.name) {
        shop.name = req.body.name;
    }
    
    if (req.body.owner) {
        shop.owner = req.body.owner;
    }
    
    if (products) {
        if (reset) shop.products = [];
        products.forEach(product => {
            let lineItems = product.lineItems ? product.lineItems : [];
            let newProduct = new Schema.Product({
                name: product.name,
                lineItems: [],
                value: 0
        });
        
        lineItems.forEach(lineItem => {
            newProduct.lineItems.push(new Schema.LineItem(lineItem));
            newProduct.value += parseFloat(lineItem.value, 10);
        });
        
        newProduct.lineItems.forEach(lineItem => {
            lineItem.save();
        });
        
        newProduct.save();
        shop.products.push(newProduct);
        });
    }
   
    if (orders) {
        if (reset) shop.orders = [];

        orders.forEach(order => {
            let lineItems = order.lineItems ? order.lineItems : [];
            let newOrder = new Schema.Order({
                name: order.name,
                lineItems: [],
                value: 0
        });
        
        lineItems.forEach(lineItem => {
            newOrder.lineItems.push(new Schema.LineItem(lineItem));
            newOrder.value += parseFloat(lineItem.value, 10);
        });
        
        newOrder.lineItems.forEach(lineItem => {
            lineItem.save();
        });
        
        newOrder.save();
        shop.orders.push(newOrder);
    });
    }
}

module.exports = router;