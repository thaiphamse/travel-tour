const statisticalService = require("../services/StatisticalService");

const statistical = async (req, res, next) => {
    console.log(1)
    try {
        let response = await statisticalService.statistical()
        res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: response
        })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

module.exports = { statistical }