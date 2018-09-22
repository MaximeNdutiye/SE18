const express = require('express');
const bodyParser = require('body-parser');
const Schema = require('./Shop');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    res.status(405).send({err: 'must specify an id for lineItem'});
});

router.get('/:id', function (req, res) {
    Schema.LineItem
    .findById(req.params.id)
    .exec(function (err, lineItem) {
        if (err) return res.status(500).send({err: err});
        if (!lineItem) return res.status(200).send({err: `lineItem ${req.params.id} not found`});
        res.status(200).send(lineItem);
    });
});

router.put('/:id', function (req, res) {
    Schema.LineItem.findById(req.params.id, function (err, lineItem) {
        if (err) return res.status(500).send({err: err});
        if (!lineItem) return res.status(200).send({err: `lineItem ${req.params.id} not found`});
        let updateLineItemMsg = updateLineItemAttributes(req, res, lineItem);
        
        if(updateLineItemMsg){
            return res.status(500).send({msg: updateLineItemMsg});
        }

        lineItem.save(function (err, updatedLineItem) {
            if (err) return res.status(500).send({err: err});
            res.status(200).send({data: updatedLineItem});
        });
    });
});

router.delete('/:id', function (req, res) {
    Schema.LineItem.findByIdAndRemove(req.params.id, function (err, removedLineItem) {
        if (err) return res.status(500).send({err: err});
        if (!removedLineItem) return res.status(200).send({err: `lineItem ${req.params.id} not found`});

        Schema.Product.find({
            'lineItems': removedLineItem._id
        }, function (err, products) {
            if (err) return res.status(500).send({err: err});
            
            products.forEach(product => {
                let index = product.lineItems.indexOf(removedLineItem._id);
                product.lineItems.splice(index, 1);
                product.value -= removedLineItem.value;
                product.save();
            });
        });
        
        Schema.Order.find({
            'lineItems': removedLineItem._id
        }, function (err, orders) {
            if (err) return res.status(500).send({err: err});
            
            orders.forEach(order => {
                let index = order.lineItems.indexOf(removedLineItem._id);
                order.lineItems.splice(index, 1);
                order.value -= removedLineItem.value;
                order.save();
            });
        });
        
        res.status(200).send({msg: `LineItem ${removedLineItem.name} & subdocs deleted`});
    });
});

function updateLineItemAttributes(req, res, lineItem){
    if (req.body.name) {
        lineItem.name = req.body.name;
    }
    
    if (req.body.value) {
        let newValue = parseFloat(req.body.value, 10);
    
        if(isNaN(newValue)){
            return 'There was a problem parsing value into a float';
        }
        
        Schema.Product.find({
            'lineItems': lineItem._id
        }, function (_, products) {
            products.forEach(product => {
                product.value += (newValue - parseFloat(lineItem.value, 10));
                lineItem.value = req.body.value;
                product.save();
            });
        });
        
        Schema.Order.find({
            'lineItems': lineItem._id
        }, function (_, orders) {
            orders.forEach(order => {
                order.value += (newValue - parseFloat(lineItem.value, 10));
                lineItem.value = req.body.value;
                order.save();
            });
        });
    }
}

module.exports = router;