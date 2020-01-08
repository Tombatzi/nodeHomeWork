var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'adminadmin',
    database: 'Student',       //tarkista onko database sama, muuten ei toimi
    dateStrings: true,
});

//Lisätään opiskelija
const addStudent = (data) => {
    return new Promise((resolve, reject) => {

        let params = [];
        let q;


        q = "INSERT INTO student (etunimi, sukunimi, postinro, osoite_idosoite, typeid) " +
            " VALUES(?, ?, ?, ?, ?) ";

        params.push(data.etunimi, data.sukunimi, data.postinro, data.osoite, data.tyyppi);
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

const addStudentAddress = (address) => {
    return new Promise((resolve, reject) => {

        let params = [];
        let q;

        q = "INSERT INTO osoite (lahiosoite) VALUES(?)"

        if (address != null) {
            params.push(address);
        }
        console.log("query:", q);

        connection.query(q, params, function (error, result, fields) {

            if (error) {
                reject(error);
                console.log("Error: ", error);
            }
            else {
                resolve(result);
                console.log("result", result);
            }
        });
    });
}

const addStudentPostalcode = (postalcode, county) => {
    return new Promise((resolve, reject) => {

        let params = [];
        let q;

        q = "INSERT INTO postinro (postinumero, postitoimipaikka) VALUES(?, ?) "

        if (postalcode != null) {
            params.push(postalcode);
        }
        if (county != null) {
            params.push(county)
        }

        console.log("querya post", q);

        connection.query(q, params, function (error, result, fields) {

            if (error) {
                reject(error);
                console.log("Error: ", error);
            }
            else {
                resolve(result);
                console.log("result: ", result);
            }
        });
    });
}
const getStudentName = (firstname, lastname, typeid) => {

    return new Promise((resolve, reject) => {

        let q = "SELECT * from student JOIN studentype ON student.typeid = studentype.typeid WHERE 1=1 ";

        let params = [];
        if (firstname != null) {
            //Jos viimeinen merkki oli *, tehdään like-haku
            if (firstname.charAt(firstname.length - 1) == '*') {
                q += " AND etunimi like  ? ";
                params.push(firstname.slice(0, -1) + '%');
            }
            else {
                q += " AND etunimi = ? ";
                params.push(firstname);
            }
        }
        if (lastname != null) {
            if (lastname.charAt(lastname.length - 1) == '*') {
                q += " AND sukunimi like  ? ";
                params.push(lastname.slice(0, -1) + '%');
            }
            else {
                q += " AND sukunimi = ? ";
                params.push(lastname);
            }

        }
        if (typeid != null) {
            q += " AND student.typeid = ? ";
            params.push(typeid);
        }

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

const getStudentAddress = (address) => {

    console.log("address:", address)
    return new Promise((resolve, reject) => {

        let q = "SELECT idosoite, lahiosoite from osoite "

        if (address != null) {
            q += " WHERE lahiosoite = '" + address + "'";
        }

        console.log("query: ", q)

        connection.query(q, function (error, result, fields) {

            if (error) {
                console.log("Errro: ", error);
                reject(error);
            }
            else {
                console.log("result: ", result);
                resolve(result);
            }
        })
    });
}

const getStudentPostalcode = (postalcode) => {

    return new Promise((resolve, reject) => {
        console.log("oistunumero", postalcode);
        let q = "SELECT postinumero from postinro ";

        if (postalcode != null) {
            q += " WHERE postinumero = '" + postalcode + "'";
        }

        console.log("quuery ", q);

        connection.query(q, function (error, result, fields) {

            if (error) {
                console.log("Error: ", error);
                reject(error);
            }
            else {
                console.log("result: ", result);
                resolve(result);
            }
        });
    });
}

const getStudentType = (typeid, status) => {

    return new Promise((resolve, reject) => {

        let q = "SELECT * from studentype WHERE 1=1 ";
        let params = [];

        if (typeid != null) {
            q += " AND typeid = ? ";
            params.push(typeid);
        }
        if (status == 0) {
            q += " AND status = ?";
            params.push(status);
        }
        if (status == 1) {
            q += " AND status = ?";
            params.push(status);
        }
        console.log("typequery: ", q);

        connection.query(q, params, function (error, result, fields) {

            if (error) {
                console.log("Error: ", error);
                reject(error);
            }
            else {
                console.log("result: ", result);
                resolve(result);
            }
        });
    });
}



module.exports = {


    addStudentData: (data) => {
        return addStudent(data);
    },
    addStudentDataAddress: (address) => {
        return addStudentAddress(address);
    },
    addStudentDataPostalcode: (postalcode, county) => {
        return addStudentPostalcode(postalcode, county);
    },
    checkStudentName: (firstname, lastname, typeid) => {
        return getStudentName(firstname, lastname, typeid);
    },
    checkStudentByFirstAndLastname: (firstname, lastname) => {
        return getStudentName(firstname,lastname, null)
    },
    checkStudentByLastnameAndType: (lastname, typeid) => {
      return getStudentName(null, lastname, typeid)  
    },
    checkStudentByFirstnameAndType: (firstname, typeid) => {
        return getStudentName(firstname, null,typeid)
    },
    checkStudentByFirstname: (firstname) => {
        return getStudentName(firstname, null, null);
    },
    checkStudentByLastname: (lastname) => {
        return getStudentName(null, lastname, null);
    },
    checkStudentByType: (typeid) => {
        return getStudentName(null, null, typeid)
    },
    checkAllStudents: () => {
        return getStudentName();
    },
    checkStudentAddress: (address) => {
        return getStudentAddress(address);
    },
    checkStudentPostalcode: (postalcode) => {
        return getStudentPostalcode(postalcode)
    },
    checkStudentType: (typeid) => {
        return getStudentType(typeid, null);
    },
    getStudentTypes: () => {
        return getStudentType(null, null);
    },
    getStudentTypesByStatus: (status) => {
        return getStudentType(null, status);
    }
}