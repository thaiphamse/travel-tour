const categoryTourService = require('../services/CategoryTourService')
const createCategory = async (req, res, next) => {
    try {
        let category = await categoryTourService.create(req.body)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: category
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}
const getAllCategory = async (req, res, next) => {
    try {
        let categories = await categoryTourService.getAll()
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: categories
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}
const deleteOneCategory = async (req, res, next) => {
    try {
        await categoryTourService.deleteOne(req.params)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}
const updateOneCategory = async (req, res, next) => {
    try {
        let categoryUpdated = await categoryTourService.updateOne(req.params, req.body)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: categoryUpdated
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}
module.exports = {
    createCategory,
    getAllCategory,
    updateOneCategory,
    deleteOneCategory
}