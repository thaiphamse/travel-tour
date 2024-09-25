const mongoose = require('mongoose');
const categoryTourModel = require('../models/CategoryTourModel')

const create = async (data) => {
    const name = data.name || null
    const thumbnail = data.thumbnail || null
    const description = data.description || null

    if (!name ||
        !thumbnail ||
        !description) {
        const error = new Error('The input in required!');
        error.status = "ERROR";
        error.statusCode = 400
        throw error;
    }
    return await categoryTourModel.create({
        name,
        thumbnail,
        description
    })
}

const getAll = async () => {
    // const page = query.page || 1
    // const limit = query.limit || 10
    // const sort = query.sort || "desc"
    // const sortBy = query.sortBy || "createdAt"
    // const skip = (page - 1) * limit;

    // let totalComment = await commentModel.find()
    // let filterTotalComment = totalComment.filter(comment => comment.tour !== null)

    // let totalPage = Math.ceil(filterTotalComment.length / limit)

    // const comments = await commentModel.find().populate({
    //     path: 'tour', // Trường được liên kết với bảng Tour
    //     match: filter, // Điều kiện lọc theo tour_code
    // })
    //         .sort([[`${sortBy}`, `${sort}`]])
    //     .limit(limit)
    //     .skip(skip);

    // const filteredComments = comments.filter(comment => comment.tour !== null);

    return await categoryTourModel.find()

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
    let isExistCategory = await categoryTourModel.find({ _id: validId }).count()
    if (isExistCategory === 0) {
        const error = new Error("Category is not found");
        error.status = "ERROR";
        error.statusCode = 404
        throw error;
    }
    return await categoryTourModel.findByIdAndRemove(validId)
}

const updateOne = async (params, data) => {
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
    let isExistCategory = await categoryTourModel.find({ _id: validId }).count()
    if (isExistCategory === 0) {
        const error = new Error("Category is not found");
        error.status = "ERROR";
        error.statusCode = 404
        throw error;
    }
    return await categoryTourModel.findByIdAndUpdate(validId, data, { new: true })
}
module.exports = {
    create,
    updateOne,
    getAll,
    deleteOne,

}

