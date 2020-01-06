var express = require('express');
var app = express();
var router = express.Router();


const ctrl = require('../controllers/customerController');

router.route('/asiakastilaukset')
    .get(ctrl.getOrders);

 
module.exports = router;