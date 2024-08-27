const tourService = require('../services/TourService')
const createTour = async (req, res, next) => {
    try {
        let createdTour = await tourService.createTour(req.body)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: createdTour
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {
    createTour
}
