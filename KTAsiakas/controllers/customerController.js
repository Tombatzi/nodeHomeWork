
const sql = require('../db/customerSQL');

module.exports = {

    getCustomer: async (req, res) => {

        try {
            let status = req.query.status;
            let orderInfo;

            if (status != null) {
                orderInfo = await sql.getCustomerByStatus(status);
            }
            else {
                orderInfo = await sql.getAllCustomers()
            }
            res.statusCode = 200;
            res.json({ status: "OK", response: orderInfo });
        }
        catch (error) {
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: error });
        }
    },
    getOrder: async (req,res) => {

        try {
            let customerData;
            let customerId = req.query.id;
            let test;
            let orderData;
            let data;
            
            if(customerId != null){
            customerData = await sql.getOrderIdByCustomerID(customerId);
            }
            else {
                customerData = await sql.getAllOrderId();
            }
            
            for(i = 0; i < customerData.length; i++){
                orderData = await sql.getOrdersData(customerData[i].tilausnumero);
                test = {tilaus : customerData[i],veroton_summa : orderData[0].veroton_summa, 
                    verollinen_summa : orderData[0].verollinen_summa};
                data = {test, data};
            }
        
            res.statusCode = 200;
            res.json({ status: "OK", response: data});
        }
        catch (error) {
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: error });
        }
    }
}