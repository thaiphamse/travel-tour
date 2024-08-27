const foodModel = require("../models/FoodModel");
// CRUD
const createFood = (newFood) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            title,
            description,
        } = newFood
        try {
            let newFoodCreated = await foodModel.create({
                name,
                title,
                description
            })
            if (!newFoodCreated)
                reject({
                    status: "ERROR",
                    message: "error",
                })
            resolve(newFoodCreated)
        } catch (error) {
            reject(error)
        }
    })
}

const updateFood = (id, updateData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let updateFood = await foodModel.findOneAndUpdate({ _id: id }, updateData, { new: true })
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
            let deleteFood = await foodModel.findByIdAndRemove(id, { new: true })

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
            let total = await foodModel.count()
            total = Math.ceil(total / limit)

            let foods = await foodModel.find(filter)
                .sort({ sortBy: sort })
                .limit(limit)
                .skip(skip)

            if (length.length == 0)
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
            let place = await foodModel.findOne(filter)
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
