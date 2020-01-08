
const sql = require('../db/JalkapalloSQL');

module.exports = {

    getEvents: async (req, res) => {
        
        try{
            
            res.statusCode = 200;
            res.json({ status: "OK", response: student });
        }
        catch(error){
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: error });
        }
    },
}