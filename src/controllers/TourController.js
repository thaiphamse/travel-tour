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
const getAllTour = async (req, res, next) => {
    try {
        let tours = await tourService.getAllTour(req.query)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            total: tours.total,
            currentPage: tours.currentPage,
            totalPage: tours.totalPage,
            sortBy: tours.sortBy,
            sort: tours.sort,
            limit: parseInt(tours.limit),
            countThisPage: tours?.tours?.length,
            data: tours?.tours
        })
    } catch (error) {
        next(error)
    }
}
const getOneTour = async (req, res, next) => {
    try {

        let tour = await tourService.getOneTour(req.params)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: tour
        })
    } catch (error) {
        next(error)
    }
}
const deleteOneTour = async (req, res, next) => {
    try {

        await tourService.deleteOneTour(req.params)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
        })
    } catch (error) {
        next(error)
    }
}

const updateOneTour = async (req, res, next) => {
    try {

        let tourUpdated = await tourService.updateOneTour(req.params, req.body)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: tourUpdated
        })
    } catch (error) {
        next(error)
    }
}
const getFiveMainTour = async (req, res, next) => {
    try {

        let mainTours = await tourService.getFiveMainTour()
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: mainTours
        })
    } catch (error) {
        next(error)
    }
}
const getImages = async (req, res, next) => {
    try {

        let images = await tourService.getImages()
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: images
        })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const getTourSlides = async (req, res, next) => {
    try {

        let images = await tourService.getTourSlides(req.query)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: images
        })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const getTourFlop = async (req, res, next) => {
    try {
        const dataRs = await tourService.getTourFlop()
        res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: dataRs
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
module.exports = {
    createTour,
    getAllTour,
    getOneTour,
    deleteOneTour,
    updateOneTour,
    getFiveMainTour,
    getImages,
    getTourSlides,
    getTourFlop
}
