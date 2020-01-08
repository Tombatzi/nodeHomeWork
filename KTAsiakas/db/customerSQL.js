var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'adminadmin',
    database: 'Asiakas',       //tarkista onko database sama, muuten ei toimi
    dateStrings: true,
});


const getCustomer = (status) => {

    return new Promise((resolve, reject) => {

        let q = `SELECT * from Asiakas INNER JOIN (SELECT Asiakas_id, count(tilausnumero) as tilaukset, 
        SUM(veroton_yksikkohinta) as yht_hinta from Tilaus JOIN Tilausrivi ON Tilaus.tilausnumero = Tilausrivi.Tilaus_id
        GROUP BY Tilaus.Asiakas_id) as Asiakastilaukset ON Asiakas.id = Asiakastilaukset.Asiakas_id WHERE 1 = 1 `;

        let params = [];
        if (status != null) {
            q += ` AND status = ?`;
            params.push(status)
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



module.exports = {

    getAllCustomerOrders: () => {
        return getCustomer(null)
    },
    getCustomerOrdersByStatus: (status) => {
        return getCustomer(status);
    },

}