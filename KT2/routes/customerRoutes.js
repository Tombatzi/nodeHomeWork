var express = require('express');
var app = express();
var router = express.Router();


const ctrl = require('../controllers/customerController');

router.route('/asiakas')
    .get(ctrl.fetch)
    .post(ctrl.addCustomer)

router.route('/asiakas/:id')
    .delete(ctrl.deleteCustomer)
    .put(ctrl.updateCustomer)
router.route('/asiakastyyppi')
    .get(ctrl.fetchType)
 
module.exports = router;