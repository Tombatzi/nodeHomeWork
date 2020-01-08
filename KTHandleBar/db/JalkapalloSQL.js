var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'adminadmin',
    database: 'jalkapallo',       //tarkista onko database sama, muuten ei toimi
    dateStrings: true,
});


const getUpcomingEvents = () => {

    return new Promise((resolve, reject) => {

        let q = "SELECT REPLACE(date_format(Pvm, '%d/%m/%Y'),'/','.') AS Pvm, Selite  FROM tapahtuma WHERE Pvm > current_date()";


        console.log("query: ", q);

        connection.query(q, function (error, result, fields) {

            if (error) {
                console.log("Error: ", error);
                reject(error);
            }
            else {
                console.log("result", result);
                resolve(result);
            }
        });
    });
}

const getStandings = () => {

    return new Promise ((resolve, reject) => {
         
        let q = `SELECT Ottelumaara, Voittoja, Tappioita,Tasapeleja,Tehdyt_maalit,Paastetyt_maalit,Pisteet,Nimi,Kaupunki 
        FROM sarjataulukko
        JOIN joukkue ON sarjataulukko.Joukkue_id = joukkue.Id`;

        console.log("query: ", q);

        connection.query(q, function (error, result, fields) {
            
            if (error) {
                console.log("Error: ", error);
                reject(error);
            }
            else {
                console.log("result", result);
                resolve(result);
            }
        });
    });
}

const getTeams = () => {
    
    return new Promise ((resolve, reject) => {

        let q = `SELECT * FROM joukkue`;

        console.log("query: ",q);

        connection.query(q, function (error, result,fields){

            if (error) {
                console.log("Error: ", error);
                reject(error);
            }
            else {
                console.log("result", result);
                resolve(result);
            }
        });
    });
}

const getPlayers = (id) => {
    
    return new Promise ((resolve, reject) => {

        let q = `SELECT * FROM pelaaja WHERE 1 = 1 `;
        let params = [];
        console.log(id);
        if(id != null) {
            
            q+= ` AND Joukkue_id = ? `
            params.push(id);
        }

        console.log("query: ",q);

        connection.query(q, params, function (error, result,fields){

            if (error) {
                console.log("Error: ", error);
                reject(error);
            }
            else {
                console.log("result", result);
                resolve(result);
            }
        });
    });
}

module.exports = {

    getUpcomingEvents: () => {
        return getUpcomingEvents();
    },
    getStandings: () => {
        return getStandings();
    },
    getTeams: () => {
        return getTeams();
    },
    getPlayers: (id) => {
        return getPlayers(id);
    }

}