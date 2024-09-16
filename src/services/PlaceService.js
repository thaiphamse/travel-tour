const { default: mongoose } = require("mongoose");
const placeModel = require("../models/PlaceModel");
const categoryModel = require('../models/CategoryModel')
// CRUD
const createPlace = (newPlace) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            title,
            description,
            addressString,
            provinceId,
            districtId,
            image,
            category } = newPlace
        try {
            const validId = mongoose.Types.ObjectId.isValid(category) ? new mongoose.Types.ObjectId(category) : null;
            if (!validId) {
                const error = new Error("Invalid category ID format");
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
            let newPlace = await placeModel.create({
                name,
                title,
                description,
                addressString,
                provinceId,
                image,
                category
            })
            newPlace = { ...newPlace._doc, categoryDb }
            if (!newPlace)
                reject({
                    status: "OK",
                    message: "error",
                })
            resolve(newPlace)
        } catch (error) {
            reject(error)
        }
    })
}

const updatePlace = (id, newPlaceData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { category } = newPlaceData
            if (category) {
                const validId = mongoose.Types.ObjectId.isValid(category) ? new mongoose.Types.ObjectId(category) : null;
                if (!validId) {
                    reject({
                        status: "ERROR",
                        message: "Invalid category ID format",
                    })
                }
            }
            let categoryDb = await categoryModel.findOne({ _id: category })
            if (!categoryDb) {
                reject({
                    status: "ERROR",
                    message: "Category is not found",
                })
            }
            let updatePlace = await placeModel.findOneAndUpdate({ _id: id }, newPlaceData, { new: true })
            updatePlace = { ...updatePlace._doc, categoryDb }
            if (!updatePlace)
                reject({
                    status: "ERROR",
                    message: "error",
                })
            resolve(updatePlace)
        } catch (error) {
            reject(error)
        }
    })
}
const deletePlace = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const validId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
            if (!validId) {
                const error = new Error("Invalid ID format");
                error.status = "ERROR";
                throw error;
            }
            let deletePlace = await placeModel.findByIdAndRemove(validId, { new: true })
            if (!deletePlace)
                reject({
                    status: "OK",
                    message: "Not found",
                })
            resolve(deletePlace)
        } catch (error) {
            reject(error.message)
        }
    })
}
const getAllPlace = ({ id, query }) => {
    return new Promise(async (resolve, reject) => {
        const page = query.page || 1
        const limit = query.limit || 10
        const sort = query.sort || "desc"
        const sortBy = query.sortBy || "createdAt"
        const provinceId = Number(query.provinceId) || null;
        const name = query.name || null
        const filter = {}
        const skip = (page - 1) * limit;
        // Lọc theo id tỉnh
        if (provinceId) {
            filter.provinceId = provinceId
        }
        // Lọc theo tên
        if (name)
            filter.name = { $regex: name, $options: 'i' }; //Optione i Không phân biệt chữ hoa chữ thường để khớp với chữ hoa và chữ thường

        try {
            let total = await placeModel.count(filter)
            let totalPage = Math.ceil(total / limit)
            let places = await placeModel.find(filter)
                .sort({ sortBy: sort })
                .limit(limit)
                .skip(skip)
                .populate('category')

            if (places.length == 0)
                reject({
                    status: "OK",
                    message: "NOT FOUND",
                })
            resolve({
                status: "OK",
                message: "Success",
                currentPage: parseInt(page),
                totalPage,
                sortBy,
                sort,
                countThisPage: places.length,
                data: places
            })
        } catch (error) {
            reject(error.message)
        }
    })
}
const getOnePlace = (id) => {
    return new Promise(async (resolve, reject) => {
        const filter = { _id: id }
        console.log(filter)
        try {
            let place = await placeModel.findOne(filter).populate('category')
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
    createPlace,
    updatePlace,
    deletePlace,
    getOnePlace,
    getAllPlace,
};
