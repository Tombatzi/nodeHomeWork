
const sql = require('../db/customerSQL');

module.exports = {

    getOrders: async (req, res) => {

        try {
            let status = req.query.status;
            let orderInfo;

            if (status != null) {
                orderInfo = await sql.getCustomerOrdersByStatus(status);
            }
            else {
                orderInfo = await sql.getAllCustomerOrders()
            }
            res.statusCode = 200;
            res.json({ status: "OK", response: orderInfo });
        }
        catch (error) {
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: error });
        }
    }
}