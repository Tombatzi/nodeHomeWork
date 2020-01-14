var express = require('express');
var cons = require('consolidate');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var asiakasSQL = require("./db/asiakasSQL");

var app = express();


app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use('/pages', express.static('public'));

const http = require('http');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;

//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var checkLogin = function (req, res, next) {

    if(req.session.username != null)
    {
        next();
    }
    else{
       return res.redirect('/');
    }
}

// Session käyttö
app.set('trust proxy', 1) // trust first proxy

app.use(session({
    secret: 'tosi_salainen_merkkijono ultra_secret', // 1. arvo -> käytetään kun hashataan data, muut arvot -> käytetään vertailuun onko data validia
    resave: false,
    saveUninitialized: true,
    name: 'JK_session_id'
}));

app.use(allowCrossDomain);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', function (req, res) {
    console.log("session",req.session);
    let msg = 'Tervetuloa sovellukseen X. Tämä on pääsivu.'

    if (req.query.message)
        msg = req.query.message;

    res.render('login', {
        message: msg,
    });
});


//TEHT 45
app.post('/login', async (req, res) => {
    console.log('/login: data=' + JSON.stringify(req.body));
 
    try {
        let username = req.body.username;
        let pw = req.body.pw;
        user = await asiakasSQL.checkLoginData(username, pw);

        if (user.length == 1) {
            req.session.username = username;
            req.session.name = user[0].nimi;
            return res.redirect('/index');
        }
        else {
            console.log("Käyttäjä", user);
            return res.redirect('/?message=Virheellinen käyttäjätunnus tai salasana');
        }
    }
    catch (error) {
        console.log(error);
    }
});


//TEHT 48
app.use(checkLogin);

app.get('/index', function (req, res) {

    res.render('index', {
        name : req.session.name,
    });
});

app.get('/news', function (req, res) {

    res.render('news');
});
//TEHT 46
app.get('/logout', function (req, res) {

    req.session.destroy();
    res.redirect('/login');
});

//TEHTÄVÄ 47

app.all('*',function (req, res) {

    res.render('notFound');
});
app.listen(port, hostname, () => {
    console.log(`Server running AT http://${hostname}:${port}/`);
});
