const { default: mongoose } = require("mongoose");
const foodModel = require("../models/FoodModel");
const categoryModel = require('../models/CategoryModel')
// CRUD
const createFood = (newFood) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            title,
            description,
            image,
            category
        } = newFood
        try {
            const validId = mongoose.Types.ObjectId.isValid(category) ? new mongoose.Types.ObjectId(category) : null;
            if (!validId) {
                const error = new Error("Invalid ID category format");
                error.status = "ERROR";
                error.statusCode = 400
                throw error;
            }
            let categoryDb = await categoryModel.findOne({ _id: category })
            if (!categoryDb) {
                reject({
                    status: "ERROR",
                    message: "Category is not found",
                })
            }
            let newFoodCreated = await foodModel.create({
                name,
                title,
                description,
                image,
                category: validId
            })
            if (!newFoodCreated)
                reject({
                    status: "ERROR",
                    message: "error",
                })
            newFoodCreated = { ...newFoodCreated._doc, categoryDb }
            resolve(newFoodCreated)
        } catch (error) {
            reject(error)
        }
    })
}

const updateFood = (id, updateData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { category } = updateData
            if (category) {
                const validId = mongoose.Types.ObjectId.isValid(category) ? new mongoose.Types.ObjectId(category) : null;
                if (!validId) {
                    reject({
                        status: "ERROR",
                        message: "Invalid category ID format",
                    })
                }
            }

            let updateFood = await foodModel.findOneAndUpdate({ _id: id }, updateData, { new: true }).populate('category')
            if (!updateFood)
                reject({
                    status: "ERROR",
                    message: "error",
                })
            resolve(updateFood)
        } catch (error) {
            reject(error)
        }
    })
}

const deleteFood = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const validId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
            if (!validId) {
                const error = new Error("Invalid ID format");
                error.status = "ERROR";
                throw error;
            }
            let deleteFood = await foodModel.findByIdAndRemove(validId, { new: true })

            if (!deleteFood)
                reject({
                    status: "ERROR",
                    message: "Not found",
                })
            resolve(deleteFood)
        } catch (error) {
            reject(error.message)
        }
    })
}
const getAllFood = ({ id, query }) => {
    return new Promise(async (resolve, reject) => {
        const page = query.page || 1
        const limit = query.limit || 10
        const sort = query.sort || "desc"
        const sortBy = query.sortBy || "createdAt"
        const name = query.name || null
        const filter = {}
        const skip = (page - 1) * limit;
        // Lọc theo tên
        if (name)
            filter.name = { $regex: name, $options: 'i' }; //Optione i Không phân biệt chữ hoa chữ thường để khớp với chữ hoa và chữ thường

        try {
            let total = await foodModel.count(filter)
            total = Math.ceil(total / limit)

            let foods = await foodModel.find(filter)
                .sort({ sortBy: sort })
                .limit(limit)
                .skip(skip)
                .populate('category')

            if (foods.length == 0)
                reject({
                    status: "OK",
                    message: "NOT FOUND",
                })
            resolve({
                status: "OK",
                message: "Success",
                currentPage: page,
                totalPage: total,
                sortBy,
                sort,
                countThisPage: foods.length,
                data: foods
            })
        } catch (error) {
            reject(error.message)
        }
    })
}
const getOneFood = (id) => {
    return new Promise(async (resolve, reject) => {
        const filter = { _id: id }

        try {
            let place = await foodModel.findOne(filter).populate('category')
            if (!place) {
                reject({
                    status: "OK",
                    message: "NO DATA FOUND",
                    data: place
                })
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: place
            })
        } catch (error) {
            reject({
                message: error.message,
                status: "ERROR"
            })
        }
    })
}
module.exports = {
    createFood,
    updateFood,
    deleteFood,
    getOneFood,
    getAllFood,
};
