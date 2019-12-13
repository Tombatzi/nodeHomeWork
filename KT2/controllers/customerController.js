
const sql = require('../db/customerSQL');

module.exports = {

    fetch: async (req, res) => {
        console.log("fetch started....");
        try {
            let nimi =  req.query.nimi;
            let osoite =  req.query.osoite;
            let id =  req.query.asty_avain
            let c;
            if(nimi == null & osoite == null & id == null){
                c = await sql.getCustomers();
            }
            if (nimi != null & osoite == null & id == null){
                c = await sql.getCustomersDataByName(nimi);
            }
            if (nimi != null & osoite != null & id == null){
                c = await sql.getCustomersDataByNameAndAddress(nimi,osoite);
            }
            if (nimi != null & osoite != null & id != null){
                c = await sql.getCustomersDataByAll(nimi,osoite,id);
            }
            if (nimi == null & osoite != null & id == null){
                c = await sql.getCustomersDataByAddress(osoite);
            }
            if (nimi == null & osoite != null & id != null){
                c = await sql.getCustomersDataByAddressAndType(osoite,id);
            }
            if (nimi == null & osoite == null & id != null){
                c = await sql.getCustomersDataByType(id);
            }
            if (nimi != null & osoite == null & id != null){
                c = await sql.getCustomersDataByNameAndType(id);
            }
            res.json({ status: "OK", response : c});
        }
        catch (err) {
            res.json({status : "not ok", msg : err});
        }
    },
    fetchType : async (req,res) => {
        console.log("fetch types" ,)
        try{
            let types;
            types = await sql.getCustomerTypes();
            res.json({status : "OK", response : types});
        }
        catch (error){
            res.json({status : "not ok", msg : error});
        }
    },
    addCustomer : async (req,res) =>{
        try{
            let customer;
            if(req.body.NIMI != "" & req.body.OSOITE != "" & req.body.POSTINRO != "" & req.body.POSTITMP != "" &
            req.body.LUONTIPVM != "" & req.body.ASTY_AVAIN != null){
            customer = await sql.addCustomerData(req.body);
            res.json({status : "OK", response : customer});
            }
            else{
                res.json({status : "Error", msg : "textfields cannot be empty"})
            }
        }
        catch(error){
            res.json({status : "not ok", msg : error});
            console.log(error);
        }
    }
}