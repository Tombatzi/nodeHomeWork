var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'adminadmin',
    database: 'Asiakas',       //tarkista onko database sama, muuten ei toimi
    dateStrings: true,
});


const getUsernameAndPw = (username,pw) => {
    
    return new Promise ((resolve, reject) => {
        console.log("asdasdasda",username,pw);
        let q = `SELECT * FROM Asiakas WHERE 1 = 1 `;
        let params = [];

        if(username != null) {
            
            q+= ` AND tunnus = ? `
            params.push(username);
        }
        if(pw != null) {
            
            q+= ` AND salasana = ? `
            params.push(pw);
        }

        console.log("query: ",q,params);

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

    checkLoginData: (username, pw) => {
        return getUsernameAndPw(username, pw);
    }

}