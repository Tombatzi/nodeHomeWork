var express = require('express');
var cons = require('consolidate');  // npm install consolidate
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session'); // npm install express-session

var app=express();

// npm install handlebars
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Jos halutaan käyttää staattisia html-sivuja, hoidetaan niiden reitys ao. koodilla
// eli hakemistossa public on .html tiedostot, kutsu niitä muodossa localhost:3000/pages/sivu.html
app.use('/pages', express.static('public'));

const http = require('http');

// Määritellään hostname ja portti
const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var checkLogin = function (req,res,next){
    //tarkista löytyykö session muuttujaa username
    //Jos ei löydy -> redirect login sivulle
    //Jos löytyy -> next()
}

// Session käyttö
app.set('trust proxy', 1) // trust first proxy

app.use(session({
    secret: 'tosi_salainen_merkkijono ultra_secret', // 1. arvo -> käytetään kun hashataan data, muut arvot -> käytetään vertailuun onko data validia
    resave: false,
    saveUninitialized: true,
    name : 'JK_session_id'
  }))

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
app.get('/', function(req,res){

    let msg = 'Tervetuloa sovellukseen X. Tämä on pääsivu.'

    if ( req.query.message )
        msg = req.query.message;

    res.render('login', {
        message: msg,
    });        

    // Tämäkin toimii, mutta tässä koodissa login.html-sivulle EI voi viedä mitään dataa
    //res.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/login', function(req, res){
    console.log('/login: data=' + JSON.stringify(req.body));
    let username = req.body.tunnus;
    let password = req.body.ss;

    if ( username == "maija" && password == "xx" )
    {
        req.session.username = username;
        return res.redirect('/news');
    }
    else
    {
        /* Voidaan tehdä näin, mutta silloin url:ssa näkyy reittinä /login -> ei välttämättä haluta 
        res.render('login', {
            message: 'Virheellinen käyttäjätunnus tai salasana',
        });*/
    
        // Välitetään data query-parametrissa 
        // Toinen vaihtoehto olisi tallettaa data sessioon -> parempi vaihtoehto niin ei käyttäjä näe url:ssa dataa ...
        return res.redirect('/?message=Virheellinen käyttäjätunnus tai salasana');
    }
});


app.get('/news', function(req,res){

    // sendFile toimii, mutta on vähän kankea tapa ...
    //res.sendFile(path.join(__dirname + '/views/news.html'));
    res.render('news');
});



app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});
