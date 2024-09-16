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

const getAll = async (query) => {
    const page = query.page || 1
    const limit = query.limit || 10
    const sort = query.sort || "desc"
    const sortBy = query.sortBy || "createdAt"
    const tour_code = query.tour_code || null
    const skip = (page - 1) * limit;
    const filter = {}

    if (tour_code)
        filter.tour_code = tour_code.toUpperCase()

    let totalComment = await commentModel.find().populate({
        path: 'tour', // Trường được liên kết với bảng Tour
        match: filter, // Điều kiện lọc theo tour_code
    })
    let filterTotalComment = totalComment.filter(comment => comment.tour !== null)

    let totalPage = Math.ceil(filterTotalComment.length / limit)

    const comments = await commentModel.find().populate({
        path: 'tour', // Trường được liên kết với bảng Tour
        match: filter, // Điều kiện lọc theo tour_code
    })
        .sort([[`${sortBy}`, `${sort}`]])
        .limit(limit)
        .skip(skip);

    const filteredComments = comments.filter(comment => comment.tour !== null);

    return { comments: filteredComments, sort, sortBy, totalPage, limit }

}
const deleteOne = async (params) => {
    let id = params.id || null
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
    // check
    let isExistComment = await commentModel.find({ _id: validId }).count()
    console.log(isExistComment)
    if (isExistComment === 0) {
        const error = new Error("Comment is not found");
        error.status = "ERROR";
        error.statusCode = 404
        throw error;
    }
    return await commentModel.findByIdAndRemove(validId)
}
module.exports = {
    createComment,
    getOne,
    getAll,
    deleteOne
}

