const mongoose = require('mongoose');
const categoryTourModel = require('../models/CategoryTourModel')

const create = async (data) => {
    const name = data.name || null
    const thumbnail = data.thumbnail || null

    if (!name ||
        !thumbnail
    ) {
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

    const categories = await categoryTourModel.aggregate([
        {
            // Thực hiện lookup để lấy các tour liên quan đến category
            $lookup: {
                from: "tours", // Tên collection của tour trong MongoDB (nếu là TourModel thì tên collection mặc định sẽ là 'tours')
                localField: "_id", // Trường trong collection category
                foreignField: "category", // Trường liên kết trong collection tour
                as: "tours" // Tên của mảng chứa các tour được trả về
            }
        },
        {
            // Thêm một trường "tour_count" để đếm số lượng tours trong mỗi category
            $addFields: {
                tour_count: { $size: "$tours" } // Đếm số lượng phần tử trong mảng "tours"
            }
        },
        {
            // Tùy chọn: chỉ trả về các trường cần thiết
            $project: {
                name: 1, // Giả sử bạn có trường "name" trong category
                tour_count: 1,
                description: 1,
                thumbnail: 1
            }
        }
    ]);

    return categories;


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

