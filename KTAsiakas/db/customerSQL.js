var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'adminadmin',
    database: 'Asiakas',       //tarkista onko database sama, muuten ei toimi
    dateStrings: true,
});


const getCustomer = (status, id) => {

    return new Promise((resolve, reject) => {

        let q = `SELECT * from Asiakas LEFT JOIN (SELECT Asiakas_id, count(distinct tilausnumero) as tilaukset, 
        SUM(veroton_yksikkohinta) as yht_hinta from Tilaus JOIN Tilausrivi ON Tilaus.tilausnumero = Tilausrivi.Tilaus_id
        GROUP BY Tilaus.Asiakas_id) as Asiakastilaukset ON Asiakas.id = Asiakastilaukset.Asiakas_id WHERE 1 = 1 `;

        let params = [];
        if (status != null) {
            q += ` AND status = ? `;
            params.push(status)
        }
        if (id != null) {
            q += ` AND Asiakas.id = ? `;
            params.push(id)
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

const getOrderId = (customerId) => {

    return new Promise((resolve, reject) => {

        let q = `SELECT * FROM Tilaus WHERE 1 = 1 `;

        let params = [];
        if (customerId != null) {
            q += ` AND Asiakas_id = ? `;
            params.push(customerId)
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

const getOrderData = (orderId) => {
    
    return new Promise((resolve, reject) => {
      
        let q = `SELECT SUM(veroton_yksikkohinta) AS veroton_summa,
        SUM(0.01*veroton_yksikkohinta * (vero_prosentti+100)) AS verollinen_summa
        FROM Tilausrivi WHERE 1 = 1 `;

        let params = [];
        if (orderId != null) {
            q += ` AND Tilaus_id = ? `;
            params.push(orderId)
        }
        q += ` GROUP BY Tilaus_id `;
     
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
    })
}


module.exports = {

    getAllCustomers: () => {
        return getCustomer(null)
    },
    getCustomerByStatus: (status) => {
        return getCustomer(status,null);
    },
    getCustomerById: (id) => {
        return getCustomer(null, id);
    },
    getAllOrderId: () => {
        return getOrderId(null);
    },
    getOrderIdByCustomerID: (id) => {
        return getOrderId(id);
    },
    getOrdersData: (orderId) => {
        return getOrderData(orderId);
    }

}