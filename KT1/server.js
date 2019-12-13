var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json());

var port = 3000;
var hostname = "127.0.0.1";

console.log("Aloitetaan");

var cors = function (req, res, next)
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(cors);


let customerController = require('./customerController');

app.route('/asiakas')

    .get(customerController.fetch);


console.log("Serveri tulille nyt");

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});