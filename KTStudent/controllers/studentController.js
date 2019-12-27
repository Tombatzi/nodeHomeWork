
const sql = require('../db/studentSQL');

module.exports = {


    addStudent: async (req, res) => {
        console.log("Add Student")
        console.log(req.body);
        
        try {
            let firstname;
            let lastname;
            let address;
            let studentAddress;
            let postalcode;
            let typeid;
            
            if (req.body.etunimi.length > 3)
            {
                firstname = req.body.etunimi
            }
            if (req.body.sukunimi.length > 3)
            {
                lastname = req.body.sukunimi
            }
            if(req.body.lahiosoite.length > 5){
                address = req.body.lahiosoite;
            }
            if(req.body.postinro.lenght == 5 & !isNaN(req.body.postinro)){
                postalcode = req.body.postalcode;
            }
            if(req.body.tyyppi.length == 1 & !isNaN(req.body.typeid)){
                typeid = req.body.typeid;
            }

            let name = await sql.checkStudentName(firstname, lastname)
            
            if (name.length == 0) {

                let add = await sql.checkStudentAddress(address);
                console.log(add);
                if(add.length == 0)
                {
                    let test = await sql.addStudentDataAddress(address);
                    console.log(test);
                    add = await sql.checkStudentAddress(address);
                    studentAddress = add[0].idosoite;
                }
                else{
                    address = await sql.checkStudentAddress(address);
                    studentAddress = add[0].idosoite;
                }
                console.log("osoote",studentAddress);
                if (req.body.etunimi != "" & req.body.sukunimi != "" & req.body.postinro.length == 5 & !isNaN(req.body.postinro)
                    & req.body.typeid != null) 
                    {
                    let studentInfo = {etunimi: req.body.etunimi, sukunimi: req.body.sukunimi, postinro: req.body.postinro, osoite: studentAddress, tyyppi:
                    req.body.typeid}
                    await sql.addStudentData(studentInfo);
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