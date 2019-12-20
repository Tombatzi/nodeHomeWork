var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'adminadmin',
    database: 'Student',       //tarkista onko database sama, muuten ei toimi
    dateStrings: true,
});

//Lisätään asiakas
const addStudent = (data) => {
    return new Promise((resolve, reject) => {

        let params = [];
        let q;

       
            q = "INSERT INTO student (etunimi, sukunimi, postinro, osoite_idosoite, typeid) " +
                " VALUES(?, ?, ?, ?, ?) ";

            params.push(data.etunimi, data.sukunimi, data.postinro, data.osoite_idosoite, data.typeid);
            console.log(params);
            console.log("query: ", q);
        
        connection.query(q, params, function (error, result, fields) {

            if (error) {
                reject(error);
                console.log("error", error);
            }
            else {
                resolve(result);
                console.log("result", result);
            }
        })
    });
}
const getStudentName = (firstname, lastname) => {

    console.log("name", firstname, lastname);
    return new Promise((resolve, reject) => {

        let q = "SELECT etunimi, sukunimi from student WHERE 1=1 ";

        let params = [];
        if (firstname != null) {
            q += " AND etunimi = ? ";
            params.push(firstname);

        }
        if (lastname != null) {
            q += " AND sukunimi = ? ";
            params.push(lastname);
        }
        q += " "

        console.log("query: ", q);

        connection.query(q, params, function (error, result, fields) {

            if (error) {
                console.log("Error: ", error);
                reject(error);
            }
            else {
                console.log("resultasd", result);
                resolve(result);

            }
        });
    });
}




module.exports = {

   
    addStudentData: (data) => {
        return addStudent(data);
    },
    checkStudentName: (firstname, lastname) =>{
        return getStudentName(firstname, lastname);
    }
}