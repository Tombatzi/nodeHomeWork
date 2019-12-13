var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: 'adminadmin',
    database: 'customer'
});

module.exports = {

    fetch: (req, res) => {
    
        console.log("/asiakas. REQ:", req.query);
        let query = "SELECT * from asiakas WHERE 1=1 ";
       
    
        console.log("query:" + query);
        connection.query(query, function (error, result, fields) {
    
            if (error) {
                console.log("Virhe", error);
                res.statusCode = 200;
                res.json({ status: "NOT OK", msg: "Tekninen virhe!" });
            }
            else {
                res.statusCode = 200;
                res.json({ status: "OK", msg: "", response: result })
            }
        });
    }
}