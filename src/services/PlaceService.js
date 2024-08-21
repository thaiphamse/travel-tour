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
                    status: "error",
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
                    status: "error",
                    message: "Not found",
                })
            resolve(deletePlace)
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createPlace,
    updatePlace,
    deletePlace
};
