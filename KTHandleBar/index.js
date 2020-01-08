var express = require('express');
var morgan = require('morgan'); //TEHT 34
var cons = require('consolidate');
var jalkapalloSQL = require('./db/JalkapalloSQL');

var app = express();
var path = require('path');

var port = 3000;
var hostname = "127.0.0.1";
var date = new Date();

var currentTime = date.getDate() +"."+(date.getMonth()+1)+"."+date.getFullYear() + " at " + date.getHours() + "." + date.getMinutes(); 


app.use(express.static('public'))
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(morgan('"[:date]" :method :url :status :response-time ms')); //TEHT 34

//TEHT 33 --
var log = (res,req,next) => {
  console.log("Pyyntö: ",res.url)
  next();
}
//TEHT 35
var customHeader = (req, res, next) =>{
  res.setHeader("Oma-Custom-Header", "'You called my node on " + currentTime+"'");
  next();
}
app.use(log);
app.use(customHeader);
//------

var navOptions = [];

navOptions.push("Valitse");
navOptions.push("Etusivu");
navOptions.push("Uutiset");
navOptions.push("Tiedot");
navOptions.push("Kirjaudu");

app.get('/', async (req, res) => {

  /* TEHTÄVÄ 28 
  let events = [];

  try{
    events = await jalkapalloSQL.getUpcomingEvents();
    console.log("Tapahtumat", events);
  }
  catch(error){
    console.log("erroria", error);
  }
  */
  res.render('index', {
    // events : [...events], TEHTÄVÄ 28
    navOption: navOptions,
  });
});

app.get('/tapahtumat', async (req, res) => {

  let events = [];

  try {
    events = await jalkapalloSQL.getUpcomingEvents();
    console.log("Tapahtumat", events);
  }
  catch (error) {
    console.log("erroria", error);
  }

  res.render('tapahtumat', {
    events: [...events]
  });
});

app.get('/sijoitukset', async (req, res) => {

  let standings = [];

  try {
    standings = await jalkapalloSQL.getStandings();
    console.log("Sijoitukset", standings);
  }
  catch (error) {
    console.log("erroria", error);
  }

  res.render('sijoitukset', {
    standings: [... standings]
  });
});

app.get('/joukkueet_pelaajat', async (req, res) => {

  let teams = [];
  let players = [];

  try {
    teams = await jalkapalloSQL.getTeams();
    players = await jalkapalloSQL.getPlayers();
    console.log("Joukkueet", teams);
    console.log("Pelaajat", players)
  }
  catch (error) {
    console.log("erroria", error);
  }

  res.render('joukkueet_pelaajat', {
    teams: [... teams],
    players: [... players]
  });
});

app.get('/joukkueet', async (req, res) => {

  let teams = [];

  try {
    teams = await jalkapalloSQL.getTeams();
  }
  catch (error) {
    console.log("erroria", error);
  }

  res.render('joukkueet', {
    teams: [... teams],
  });
});

app.get('/pelaajat', async (req, res) => {

  let players = [];
  let id = req.query.id;
  try {
    players = await jalkapalloSQL.getPlayers(id);
  }
  catch (error) {
    console.log("erroria", error);
  }

  res.render('pelaajat', {
    players: [... players],
  });
});

app.listen(port, hostname, () => {
  console.log(`Server Running at http://${hostname}:${port}/`);
});