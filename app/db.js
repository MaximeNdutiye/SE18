const mongoose = require('mongoose');
require('dotenv').config();

const dbpsw = process.env.DBPSW;
var uri = 'mongodb+srv://dbuser:' + dbpsw + process.env.DB_CLUSTER;
mongoose.connect(uri, { useNewUrlParser: true });