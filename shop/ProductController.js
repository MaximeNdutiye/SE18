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
    Schema.Shop.findOne({'products._id': req.params.id}, function (err, shop) {
        if (err) return res.status(500).send({err: err});
        if (!shop) return res.status(404).send({err: 'product ' + req.params.id + ' not found'});
        
        let product = shop.products.filter(product => product.id === req.params.id);
        res.status(200).send({data: product});
    });
});

module.exports = router;
