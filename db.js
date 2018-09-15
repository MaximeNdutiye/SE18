const mongoose = require('mongoose');
require('dotenv').config();

const dbpsw = process.env.DBPSW;
var uri = 'mongodb+srv://dbuser:' + dbpsw + '@cluster0-9peje.mongodb.net/shopify';
mongoose.connect(uri, { useNewUrlParser: true });