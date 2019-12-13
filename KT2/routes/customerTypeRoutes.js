var express = require('express');
var app = express();
var router = express.Router();


const ctrl = require('../controllers/customerController');

router.route('/asiakas')
    .get(ctrl.fetch);
router.route('/asiakastyyppi')
    .get(ctrl.fetchType)
    //Julkaistaan router-funktio tämän filun ulkopuolelle (kapselointi)
module.exports = router;