var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

const port = 3000;
const hostname = '127.0.0.1'

const cors = (req,res,next) =>{
    
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Type','Content-Type');
    next();
}

app.use(cors);

// importataan reitit(Nodessa require)

const customerRoutes = require('./routes/customerRoutes');
app.use(customerRoutes);


app.listen(port,hostname,() =>{
    console.log(`Server running at http://${hostname}:${port}/`);
});
