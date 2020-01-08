
const sql = require('../db/studentSQL');

module.exports = {


    addStudent: async (req, res) => {
        console.log("Add Student")
        console.log(req.body);

        try {
            let firstname;
            let lastname;
            let address;
            let postalcode;
            let county;
            let typeid;

            //Tarkastetaan onko kaikki arvot annettu
            if (req.body.etunimi.length > 2) {
                firstname = req.body.etunimi
            }
            else {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Name too short" });
            }
            if (req.body.sukunimi.length > 3) {
                lastname = req.body.sukunimi
            }
            else {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Name too short" });
            }
            if (req.body.lahiosoite.length > 5) {
                address = req.body.lahiosoite;
            }
            else {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Address too short" });
            }
            if (req.body.postinro.length == 5 & !isNaN(req.body.postinro)) {
                postalcode = req.body.postinro;
            }
            else {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Postal code must contain 5 numbers" });
            }
            if (req.body.postitoimipaikka.length > 2) {
                county = req.body.postitoimipaikka;
            }
            else {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "County name too short" });
            }
            if (req.body.tyyppi.length == 1 & !isNaN(req.body.tyyppi)) {
                typeid = req.body.tyyppi;
            }
            else {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Invalid student type" });
            }

            //Tarkistetaan onko opiskelijatyyppi "tuettu"

            let checkForStudentType = await sql.checkStudentType(typeid)

            if (checkForStudentType[0].status == 0) {
                //Tarkistetaan löytyykö nimi kannasta

                let checkForName = await sql.checkStudentName(firstname, lastname)

                if (checkForName.length == 0) {

                    //Jos nimeä ei löydy kannasta, tarkistetaan löytyykö osoite, jos ei löydy niin lisätään

                    let checkForAddress = await sql.checkStudentAddress(address);

                    if (checkForAddress.length == 0) {
                        await sql.addStudentDataAddress(address);
                        checkForAddress = await sql.checkStudentAddress(address);
                        address = checkForAddress[0].idosoite;
                    }
                    else {
                        address = checkForAddress[0].idosoite;
                    }

                    //Tarkistetaan löytyykö postinumero, jos ei löydy niin lisätään
                    let checkForPostalcode = await sql.checkStudentPostalcode(postalcode);

                    if (checkForPostalcode.length == 0) {
                        await sql.addStudentDataPostalcode(postalcode, county);
                        checkForPostalcode = await sql.checkStudentPostalcode(postalcode);
                        postalcode = checkForPostalcode[0].postinumero;
                    }
                    else {
                        postalcode = checkForPostalcode[0].postinumero;
                    }
                    //Lisätään opiskelijan tiedot kantaan
                    let studentData = { etunimi: firstname, sukunimi: lastname, postinro: postalcode, osoite: address, tyyppi: typeid }
                    await sql.addStudentData(studentData);
                    res.statusCode = 200;
                    res.json({ status: "OK", response: "student added" });
                }
                else {
                    res.statusCode = 400;
                    res.json({ status: "NOT OK", msg: "Student already in db" })
                }
            }
            else {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "StudentType not supported at the moment" })
            }
        }
        catch (error) {
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: error.sqlMessage });
            console.log(error);
        }
    },
    getStudent: async (req, res) => {
        
        try{
            let student;
            let firstname = req.query.etunimi;
            let lastname = req.query.sukunimi;
            let type = req.query.typeid

            if(firstname != null & lastname != null & type != null){
                student = await sql.checkStudentName(firstname, lastname, type)
            }
            if(firstname == null & lastname != null & type != null){
                student = await sql.checkStudentByLastnameAndType(lastname, type)
            }
            if(firstname != null & lastname == null & type != null){
                student = await sql.checkStudentByFirstnameAndType(firstname, type)
            }
            if(firstname != null & lastname != null & type == null){
                student = await sql.checkStudentByFirstAndLastname(firstname, lastname)
            }
            if(firstname != null & lastname == null & type == null){
                student = await sql.checkStudentByFirstname(firstname)
            }
            if(firstname == null & lastname != null & type == null){
                student = await sql.checkStudentByLastname(lastname)
            }
            if(firstname == null & lastname == null & type != null){
                student = await sql.checkStudentByType(type)
            }
            if(firstname == null & lastname == null & type == null){
                student = await sql.checkAllStudents()
            }
            res.statusCode = 200;
            res.json({ status: "OK", response: student });
        }
        catch(error){
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: error });
        }
    },
    getStudentType: async (req,res) => {

        try{
            let status = req.query.status;
            let type;

            type = await sql.getStudentTypesByStatus(status)
            res.statusCode = 200;
            res.json({ status: "OK", response: type });
        }
        catch(error){
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: error });
        }
    }
}