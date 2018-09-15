const express = require('express');
const bodyParser = require('body-parser');
const Schema = require('./Shop');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', function (req, res) {
    Schema.Shop.create({
            name : req.body.name,
            owner : req.body.owner,
            products : JSON.parse(req.body.products),
            orders : JSON.parse(req.body.orders)
        }, 
        function (err, user) {
            if (err) return res.status(500).send({err: err});
            res.status(200).send({data: user});
        });
});

router.get('/', function (req, res) {
    Schema.Shop.find({}, function (err, shops) {
        if (err) return res.status(500).send({err: err});
        res.status(200).send({data: shops});
    });
});

router.get('/:id', function (req, res) {
    Schema.Shop.findById(req.params.id, function (err, shop) {
        if (err) return res.status(500).send({err: err});
        if (!shop) return res.status(404).send({err: "shop " + req.params.id + " not found"});
        res.status(200).send({data: shop});
    });
});

router.delete('/:id', function (req, res) {
    Schema.Shop.findByIdAndRemove(req.params.id, function (err, shop) {
        if (err) return res.status(500).send({err: err});
        res.status(200).send({msg: "Shop "+ shop.name +" was deleted."});
    });
});

router.put('/:id', function (req, res) {
    Schema.Shop.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, shop) {
        if (err) return res.status(500).send({err: err});
        res.status(200).send({data: shop});
    });
});

module.exports = router;