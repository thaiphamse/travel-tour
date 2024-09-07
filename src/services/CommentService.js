const mongoose = require('mongoose');
const tourModel = require('../models/TourModel')
const commentModel = require('../models/CommentModel')

const createComment = async (data) => {
    const {
        fullname,
        email,
        phone,
        tour,
        content
    } = data

    if (!fullname ||
        !phone ||
        !tour ||
        !content) {
        const error = new Error('The input in required!');
        error.status = "ERROR"
        error.statusCode = 400; // Bad Request
        throw error;
    }
    const validId = mongoose.Types.ObjectId.isValid(tour) ? new mongoose.Types.ObjectId(tour) : null;
    if (!validId) {
        const error = new Error("Invalid ID format");
        error.status = "ERROR";
        throw error;
    }

    // check tour id
    let isExistTour = await tourModel.count({ _id: validId })
    if (!isExistTour) {
        const error = new Error("Not found tour for id: " + validId);
        error.status = "ERROR";
        error.statusCode = 404
        throw error;
    }
    return await commentModel.create({
        fullname,
        email,
        phone,
        tour,
        content
    })
}

const getOne = async (params) => {
    const { id } = params
    if (!id) {
        const error = new Error("The id is required");
        error.status = "ERROR";
        error.statusCode = 400
        throw error;
    }
    const validId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    if (!validId) {
        const error = new Error("Invalid ID format");
        error.status = "ERROR";
        error.statusCode = 400
        throw error;
    }
    return await commentModel.find({ _id: validId })
        .populate('tour', '_id name tour_code')
}
module.exports = {
    createComment,
    getOne
}

