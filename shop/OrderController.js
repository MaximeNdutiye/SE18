const express = require('express');
const bodyParser = require('body-parser');
const Schema = require('./Shop');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    res.status(405).send({err: 'must specify an id for order'});
});

router.get('/:id', function (req, res) {
    Schema.Order
    .findById(req.params.id)
    .populate([
        {
            path:'lineItems',		
	        populate: {
	            path:  'lineItems',
		        model: 'LineItem' }
            
        }
    ]).exec(function (err, product) {
        if (err) return res.status(500).send({err: err});
        if (!product) return res.status(500).send({err: 'order ' + req.params.id + ' not found'});
        
        res.status(200).send(product);
    });
});

router.get('/:id/lineitems', function (req, res) {
    Schema.Order
    .findById(req.params.id)
    .select({'lineItems': 1})
    .populate([
        {
            path:'lineItems',		
	        populate: {
	            path:  'lineItems',
		        model: 'LineItem' }
            
        }
    ]).exec(function (err, order) {
        if (err) return res.status(500).send({err: err});
        if (!order) return res.status(500).send({err: `order  ${req.params.id} not found`});
        
        res.status(200).send(order);
    });
});

router.put('/:id', function (req, res) {
    Schema.Order.findById(req.params.id, function (err, order) {
        if (err) return res.status(500).send({err: err});
        if (!order) return res.status(500).send({err: `order  ${req.params.id} not found`});

        updateOrderAttributes(req, order);

        order.save(function (err, updatedOrder) {
            if (err) return res.status(500).send({err: err});
            res.status(200).send({data: updatedOrder});
        });
    });
});

router.delete('/:id', function (req, res) {
    Schema.Order.findByIdAndRemove(req.params.id, function (err, removedOrder) {
        if (err) return res.status(500).send({err: err});
        if (!removedOrder) return res.status(500).send({err: `order  ${req.params.id} not found`});

        removedOrder.lineItems.forEach(lineItem => {
            Schema.LineItem.findByIdAndRemove(lineItem._id, function(err, removedLineItem) {
                if (err) return res.status(500).send({err: err});
            });
        });
        
        Schema.Shop.find({
            'orders': removedOrder._id
        }, function (err, shops) {
            if (err) return res.status(500).send({err: err});
            
            shops.forEach(shop => {
                let index = shop.products.indexOf(removedOrder._id);
                shop.products.splice(index, 1);
                shop.save();
            });
        });
        
        res.status(200).send({msg: `Order ${removedOrder.name} & subdocs deleted`});
    });
});

function updateOrderAttributes(req, order){
    let lineItems = req.body.lineItems ? JSON.parse(req.body.lineItems) : null;

    if (req.body.name) {
        order.name = req.body.name;
    }
    
    if (lineItems) {
        lineItems.forEach(lineItem => {
            let newLineItem = new Schema.LineItem(lineItem);
            order.lineItems.push(newLineItem);
            
            newLineItem.save();
            order.value += parseFloat(lineItem.value, 10);
        });
    }
}

module.exports = router;
