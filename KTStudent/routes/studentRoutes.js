var express = require('express');
var app = express();
var router = express.Router();


const ctrl = require('../controllers/studentController');

router.route('/student')
    .post(ctrl.addStudent)
    .get(ctrl.getStudent);
router.route('/studenttype')
    .get(ctrl.getStudentType)
router.route('/studentpostalcode')
    .get(ctrl.getPostalCodes)
 
module.exports = router;