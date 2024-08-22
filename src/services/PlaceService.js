const placeModel = require("../models/PlaceModel");
// CRUD
const createPlace = (newPlace) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            description,
            addressString,
            provinceId,
            districtId,
            wardId,
            location } = newPlace
        try {
            let newPlace = await placeModel.create({
                name,
                description,
                addressString,
                provinceId,
                districtId,
                wardId,
                location
            })
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
        const {
            name,
            description,
            addressString,
            provinceId,
            districtId,
            wardId,
            location } = newPlaceData
        try {
            let updatePlace = await placeModel.findOneAndUpdate({
                _id: id
            },
                {
                    name,
                    description,
                    addressString,
                    provinceId,
                    districtId,
                    wardId,
                    location
                },
                {
                    new: true
                }
            )
            if (!updatePlace)
                reject({
                    status: "error",
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
            let deletePlace = await placeModel.findByIdAndRemove(id, { new: true })
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
        const { page } = query || 1
        const { limit } = query || 10
        const { sort } = query || "desc"
        const { sortBy } = query || "createdAt"
        const provinceId = Number(query.provinceId) || null;
        const { name } = query || null
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
            let total = await placeModel.count()
            total = Math.ceil(total / limit)

            let places = await placeModel.find(filter)
                .sort({ sortBy: sort })
                .limit(limit)
                .skip(skip)

            if (!places)
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

        try {
            let place = await placeModel.findOne(filter)
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
