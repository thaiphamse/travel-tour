const { default: mongoose } = require("mongoose");
const blogModel = require("../models/BlogModel");
const categoryModel = require('../models/CategoryModel')
// CRUD
const createBlog = (newBlogData) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            title,
            description,
            addressString,
            provinceId,
            type,
            image,
            category } = newBlogData
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
            let newBlog = await blogModel.create({
                name,
                title,
                description,
                addressString,
                provinceId,
                image,
                category,
                type
            })
            if (!newBlog)
                reject({
                    status: "OK",
                    message: "error",
                })
            resolve(newBlog.populate('category'))
        } catch (error) {
            reject(error)
        }
    })
}

const updateBlog = (id, newBlogData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { category } = newBlogData
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
            let updateBlog = await blogModel.findOneAndUpdate({ _id: id }, newBlogData, { new: true })
            if (!updateBlog)
                reject({
                    status: "ERROR",
                    message: "Blog is not found",
                })
            resolve(updateBlog.populate('category'))
        } catch (error) {
            reject(error)
        }
    })
}
const deleteBlog = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const validId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
            if (!validId) {
                const error = new Error("Invalid ID format");
                error.status = "ERROR";
                throw error;
            }
            let deleteBlog = await blogModel.findByIdAndRemove(validId, { new: true })
            if (!deleteBlog)
                reject({
                    status: "OK",
                    message: "Not found",
                })
            resolve(deleteBlog)
        } catch (error) {
            reject(error.message)
        }
    })
}
const getAllBlog = ({ id, query }) => {
    return new Promise(async (resolve, reject) => {
        const page = query.page || 1
        const limit = query.limit || 10
        const sort = query.sort || "desc"
        const sortBy = query.sortBy || "createdAt"
        const provinceId = Number(query.provinceId) || null;
        const name = query.name || null
        const type = query.type || null
        const filter = {}
        const skip = (page - 1) * limit;
        // Lọc theo id tỉnh
        if (provinceId) {
            filter.provinceId = provinceId
        }
        if (type) {
            filter.type = type
        }
        // Lọc theo tên
        if (name)
            filter.name = { $regex: name, $options: 'i' }; //Optione i Không phân biệt chữ hoa chữ thường để khớp với chữ hoa và chữ thường

        try {
            let total = await blogModel.count(filter)
            let totalPage = Math.ceil(total / limit)
            let places = await blogModel.find(filter)
                .sort([[`${sortBy}`, `${sort}`]])
                .limit(limit)
                .skip(skip)
                .populate('category')

            if (places.length == 0)
                reject({
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
const getOneBlog = (id) => {
    return new Promise(async (resolve, reject) => {
        const filter = { _id: id }
        console.log(filter)
        try {
            let place = await blogModel.findOne(filter).populate('category')
            if (!place) {
                reject({
                    status: "OK",
                    message: "NO DATA FOUND",
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
    createBlog,
    updateBlog,
    deleteBlog,
    getOneBlog,
    getAllBlog,
};
