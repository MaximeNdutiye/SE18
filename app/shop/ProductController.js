const express = require('express');
const bodyParser = require('body-parser');
const Schema = require('./Shop');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    res.status(405).send({err: 'must specify an id for product'});
});

router.get('/:id', function (req, res) {
    Schema.Product
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
        if (!product) return res.status(500).send({err: 'product ' + req.params.id + ' not found'});
        
        res.status(200).send(product);
    });
});

router.get('/:id/lineitems', function (req, res) {
    Schema.Product
    .findById(req.params.id)
    .select({'lineItems': 1})
    .populate([
        {
            path:'lineItems',		
	        populate: {
	            path:  'lineItems',
		        model: 'LineItem' }
            
        }
    ]).exec(function (err, product) {
        if (err) return res.status(500).send({err: err});
        if (!product) return res.status(500).send({err: `product  ${req.params.id} not found`});
        
        res.status(200).send(product);
    });
});

router.put('/:id', function (req, res) {
    Schema.Product.findById(req.params.id, function (err, product) {
        if (err) return res.status(500).send({err: err});
        if (!product) return res.status(500).send({err: 'product ' + req.params.id + ' not found'});
        updateProductAttributes(req, product);

        product.save(function (err, updatedProduct) {
            if (err) return res.status(500).send({err: err});
            res.status(200).send({data: updatedProduct});
        });
    });
});

router.delete('/:id', function (req, res) {

    Schema.Product.findByIdAndRemove(req.params.id, function (err, removedProduct) {
        if (err) return res.status(500).send({err: err});
        if (!removedProduct) return res.status(500).send({err: 'product ' + req.params.id + ' not found'});

        removedProduct.lineItems.forEach(lineItem => {
            Schema.LineItem.findByIdAndRemove(lineItem._id, function(err, removedLineItem) {
                if (err) return res.status(500).send({err: err});
            });
        });
        
        Schema.Shop.find({
            'products': removedProduct._id
        }, function (err, shops) {
            if (err) return res.status(500).send({err: err});
            
            shops.forEach(shop => {
                let index = shop.products.indexOf(removedProduct._id);
                shop.products.splice(index, 1);
                shop.save();
            });
        });
        
        res.status(200).send({msg: `Product ${removedProduct.name} & subdocs deleted`});
    });
});

function updateProductAttributes(req, product){
    let lineItems = req.body.lineItems ? JSON.parse(req.body.lineItems) : null;

    if (req.body.name) {
        product.name = req.body.name;
    }
    
    if (lineItems) {
        lineItems.forEach(lineItem => {
            let newLineItem = new Schema.LineItem(lineItem);
            product.lineItems.push(newLineItem);
            
            newLineItem.save();
            product.value += parseFloat(lineItem.value, 10);
        });
    }
}

module.exports = router;