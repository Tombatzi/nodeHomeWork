
const sql = require('../db/studentSQL');

module.exports = {


    addStudent: async (req, res) => {
        console.log("Add Student")
        console.log(req.body);
        try {

            let name = await sql.checkStudentName(req.body.etunimi, req.body.sukunimi)
            
            if (name.length == 0) {

                if (req.body.etunimi != "" & req.body.sukunimi != "" & req.body.postinro.length == 5 & !isNaN(req.body.postinro) & req.body.osoite_idosoite != ""
                    & req.body.typeid != null) 
                    {
                    await sql.addStudentData(req.body);
                    res.statusCode = 200;
                    res.json({ status: "OK", response: "student added" });
                }
                else {
                    res.statusCode = 400;
                    res.json({ status: "NOT OK", msg: "textfields cannot be empty and postinro must contain only five numbers" })
                }
            }
            else {
                res.statusCode = 400;
                    res.json({ status: "NOT OK", msg: "Student already in db" })
            }
        }
        catch (error) {
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: error.sqlMessage });
            console.log(error);
        }
    }
}