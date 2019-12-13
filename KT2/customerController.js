var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'adminadmin',
    database: 'customer'
});

module.exports = {
    
    fetch: (req, res) =>{

        console.log("/asiakas. REQ:", req.query);
       
        let params= [];
        let query = "SELECT AVAIN as id, NIMI, OSOITE, POSTINRO,POSTITMP,LUONTIPVM as pvm, ASTY_AVAIN as asty_id from asiakas WHERE 1=1 ";
        if(req.query.nimi != null){
            query = query + " AND NIMI like ?";
            params.push(req.query.nimi);
        }
        if(req.query.osoite != null){
            query = query + " AND OSOITE like ?";
            params.push(req.query.osoite);
        }
        if(req.query.asty_avain != null){
            query = query + " AND ASTY_AVAIN like ?";
            params.push(req.query.asty_avain);
        }

        connection.query(query, params, function (error, result, fields) {
    
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