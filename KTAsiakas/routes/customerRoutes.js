var express = require('express');
var app = express();
var router = express.Router();


const ctrl = require('../controllers/customerController');

router.route('/asiakas')
    .get(ctrl.getCustomer)
    router.route('/tilaus')
    .get(ctrl.getOrder);
 
module.exports = router;