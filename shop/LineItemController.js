const express = require('express');
const bodyParser = require('body-parser');
const Schema = require('./Shop');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    res.status(405).send({err: 'must specify an id'});
});

router.get('/:id', function (req, res) {
    Schema.Shop.findOne({'products.lineItems._id': req.params.id}, function (err, shop) {
        if (err) return res.status(500).send({err: err});
        if (!shop) return res.status(404).send({err: 'line item ' + req.params.id + ' not found'});
        
        // let order = shop.products.filter(order => order.id === req.params.id);
        res.status(200).send({data: shop.products});
    });
});

module.exports = router;