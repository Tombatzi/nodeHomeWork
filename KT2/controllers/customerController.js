
const sql = require('../db/customerSQL');

module.exports = {

    fetch: async (req, res) => {
        console.log("fetch started....");
        try {
            let nimi = req.query.nimi;
            let osoite = req.query.osoite;
            let id = req.query.asty_avain
            let c;
            if (nimi == null & osoite == null & id == null) {
                c = await sql.getCustomers();
            }
            if (nimi != null & osoite == null & id == null) {
                c = await sql.getCustomersDataByName(nimi);
            }
            if (nimi != null & osoite != null & id == null) {
                c = await sql.getCustomersDataByNameAndAddress(nimi, osoite);
            }
            if (nimi != null & osoite != null & id != null) {
                c = await sql.getCustomersDataByAll(nimi, osoite, id);
            }
            if (nimi == null & osoite != null & id == null) {
                c = await sql.getCustomersDataByAddress(osoite);
            }
            if (nimi == null & osoite != null & id != null) {
                c = await sql.getCustomersDataByAddressAndType(osoite, id);
            }
            if (nimi == null & osoite == null & id != null) {
                c = await sql.getCustomersDataByType(id);
            }
            if (nimi != null & osoite == null & id != null) {
                c = await sql.getCustomersDataByNameAndType(id);
            }
            res.json({ status: "OK", response: c });
        }
        catch (err) {
            res.json({ status: "not ok", msg: err });
        }
    },
    fetchType: async (req, res) => {
        console.log("fetch types")
        try {
            let types;
            types = await sql.getCustomerTypes();
            res.json({ status: "OK", response: types });
        }
        catch (error) {
            res.json({ status: "not ok", msg: error });
        }
    },
    addCustomer: async (req, res) => {
       console.log("Add Customer")
        try {
            if (req.body.error) {
                await sql.addCustomerData("error")
            }
            else if (req.body.NIMI != "" & req.body.OSOITE != "" & req.body.POSTINRO != "" & !isNaN(req.body.POSTINRO) & req.body.POSTITMP != "" &
                req.body.ASTY_AVAIN != null) {

                await sql.addCustomerData(req.body);
                res.statusCode = 200;
                res.json({ status: "OK", response: "customer added" });
            }
            else {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "textfields cannot be empty and POSTINRO must contain only numbers" })
            }
        }
        catch (error) {
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: error.sqlMessage });
            console.log(error);
        }
    },
    deleteCustomer: async(req,res) =>{
        console.log("Delete customer")
        try{
            let id = req.params.id;
            console.log("cust",id);
            let info =  await sql.deleteCustomerData(id);

            if(info.affectedRows != 0){
                res.statusCode = 200;
                res.json({status: "OK", msg: "Customer " + id + " deleted"});
            }
            else{
                res.statusCode = 404;
                res.json({status: "NOT OK",msg: "cannot find customer"});
            }
            console.log(info)

        }catch(error){
            res.statusCode = 404;
            res.json({status: "NOT OK",msg: error});
            console.log(error);
        }

    },
    updateCustomer: async(req,res) =>{
        console.log("Update Customer");
        
        try
        {
            let id = req.params.id;
            let data = req.body;
            console.log(data);
            let resData = await sql.updateCustomerData(id, data);
            res.json({status : "OK", msg: "customer data changed", response : resData});
        }
        catch(error){
            res.statusCode = 404;
            res.json({status: "NOT OK",msg: error});
            console.log(error);
        }
    }
}