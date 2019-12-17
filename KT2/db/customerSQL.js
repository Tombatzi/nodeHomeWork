var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'adminadmin',
    database: 'customer',       //tarkista onko database sama, muuten ei toimi
    dateStrings: true,
});
//Haetaan asiakastyypit
const getTypes = () => {
    return new Promise((resolve, reject) => {

        let q = "SELECT * from asiakastyyppi "

        connection.query(q, function (error, result, fields) {

            if (error) {
                console.log("error: ", error);
                reject(error);
            }
            else {
                console.log("result: ", result);
                resolve(result);
            }
        })
    });
}
//Haetaan asiakkaat
const getCustomersData = (name, address, typeId) => {

    console.log("name", name);
    return new Promise((resolve, reject) => {

        let q = "SELECT asiakas.AVAIN, NIMI, OSOITE, POSTINRO, POSTITMP, date_format(LUONTIPVM, '%d/%m/%Y') AS LUONTIPVM, MUUTOSPVM, ASTY_AVAIN," +
            "SELITE from asiakas JOIN asiakastyyppi on asiakastyyppi.AVAIN = asiakas.ASTY_AVAIN WHERE 1=1 ";

        let params = [];
        if (name != null) {
            q += " AND NIMI like ? ";
            params.push(name);

        }
        if (address != null) {
            q += " AND OSOITE like ? ";
            params.push(address);
        }
        if (typeId != null) {
            q += " AND ASTY_AVAIN like ?";
            params.push(typeId);
        }
        q += " "

        console.log("query: ", q);

        connection.query(q, params, function (error, result, fields) {

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
//Lisätään asiakas
const addCustomer = (data) => {
    return new Promise((resolve, reject) => {

        let params = [];
        let q;

        if (data == "error") {
            q = "INERT INTO asiakas();"
        }
        else {
            q = "INSERT INTO asiakas (NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, MUUTOSPVM, ASTY_AVAIN) " +
                " VALUES(?, ?, ?, ?, current_date(), now(), ?) ";

            params.push(data.NIMI, data.OSOITE, data.POSTINRO, data.POSTITMP, data.ASTY_AVAIN);
            console.log(params);
            console.log("query: ", q);
        }
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

//Poistetaan asiakas

const delCustomer = (id) => {
    return new Promise((resolve, reject) => {
        let q;
        q = "DELETE FROM asiakas WHERE AVAIN = ";

        if (id != null) {
            q += id;
            console.log("query",q);
        }
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

    const updateCustomer = (id, data) =>{
        return new Promise((resolve,reject) => {
            let q;
            let params = [];
            q = "UPDATE asiakas set ";
            
            if (id != null) {
                q+= " MUUTOSPVM = NOW() "
                if(data.NIMI != null){
                    q+= ", NIMI = ? ";
                    params.push(data.NIMI);
                }
                if(data.OSOITE != null){
                    q+= ", OSOITE = ? ";
                    params.push(data.OSOITE);
                }
                if(data.POSTINRO != null){
                    q+= ", POSTINRO = ? ";
                    params.push(data.POSTINRO);
                }
                if(data.POSTITMP != null){
                    q+= ", POSTITMP = ? ";
                    params.push(data.POSTITMP);
                }
                if(data.ASTY_AVAIN != null){
                    q+= ", ASTY_AVAIN = ? "
                    params.push(data.ASTY_AVAIN);
                }
                q+= "WHERE AVAIN = "+id;
            }

            console.log("query: ",q);
            
            connection.query(q, params, function (error, result, fields) {

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

    getCustomerTypes: () => {
        return getTypes();
    },
    addCustomerData: (data) => {
        return addCustomer(data);
    },
    deleteCustomerData: (id) => {
        return delCustomer(id);
    },
    updateCustomerData: (id, data) =>{
        return updateCustomer(id, data);
    },
    getCustomers: () => {
        return getCustomersData(null, null, null);
    },
    getCustomersDataByName: (name) => {
        return getCustomersData(name, null, null);
    },
    getCustomersDataByAddress: (address) => {
        return getCustomersData(null, address, null);
    },
    getCustomersDataByType: (typeId) => {
        return getCustomersData(null, null, typeId);
    },
    getCustomersDataByNameAndAddress: (name, address) => {
        return getCustomersData(name, address, null);
    },
    getCustomersDataByNameAndType: (name, typeId) => {
        return getCustomersData(name, null, typeId);
    },
    getCustomersDataByAddressAndType: (address, typeId) => {
        return getCustomersData(null, address, typeId);
    },
    getCustomersDataByAll: (name, address, typeId) => {
        return getCustomersData(name, address, typeId);
    },
}