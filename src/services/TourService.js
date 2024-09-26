const { default: mongoose, trusted } = require('mongoose');
const tourModel = require('../models/TourModel')
const categoryTour = require('../models/CategoryTourModel')
const bookingModel = require('../models/BookingModel')
const createTour = async (tourData) => {
    const { tour_code,
        name,
        description,
        shedule_on_week,
        transportation,
        start_location,
        end_location,
        base_price_adult,
        base_price_child,
        hotel_level,
        schedules,
        image,
        category } = tourData

    if (!tour_code ||
        !name ||
        !description ||
        !shedule_on_week ||
        !transportation ||
        !start_location ||
        !end_location ||
        schedules.length === 0) {

        const error = new Error('The input in required!');
        error.status = "ERROR"
        error.statusCode = 400; // Bad Request
        throw error;
    }
    if (category) {
        const validId = mongoose.Types.ObjectId.isValid(category) ? new mongoose.Types.ObjectId(category) : null;
        if (!validId) {
            const error = new Error("Invalid category ID format");
            error.status = "ERROR";
            error.statusCode = 400
            throw error;
        }
    }
    let categoryDb = await categoryTour.findOne({ _id: category })
    if (!categoryDb) {
        const error = new Error("Category is not found");
        error.status = "ERROR";
        error.statusCode = 404
        throw error;
    }
    const tour = await tourModel.findOne({ tour_code: tour_code })
    if (tour) {
        const error = new Error('Trùng giá trị tour code!');
        error.status = "ERROR"
        error.statusCode = 400; // Bad Request
        throw error;
    }
    let tourSaved = await tourModel.create({
        tour_code,
        name,
        description,
        shedule_on_week,
        transportation,
        start_location,
        end_location,
        base_price_adult,
        base_price_child,
        hotel_level,
        schedules,
        image,
        category
    })
    return await tourSaved.populate('category')
}
const getAllTour = async (query) => {
    const page = query.page || 1
    const limit = query.limit || 10
    const sort = query.sort || "desc"
    const sortBy = query.sortBy || "createdAt"
    const provinceId = Number(query.provinceId) || null;
    const name = query.name || null
    const tour_code = query.code || null
    const filter = {}
    const skip = (page - 1) * limit;
    // Lọc theo id tỉnh
    if (provinceId) {
        filter.provinceId = provinceId
    }

    // Lọc theo tên
    if (name)
        filter.name = { $regex: name, $options: 'i' };
    if (tour_code)
        filter.tour_code = tour_code.toUpperCase()
    try {
        let total = await tourModel.count(filter)
        let totalPage = Math.ceil(total / limit)
        let tours = await tourModel.find(filter)
            .sort([[`${sortBy}`, `${sort}`]])
            .limit(limit)
            .skip(skip)
            .populate('category')

        if (tours.length === 0) {
            const error = new Error("Not found tour");
            error.status = "ERROR"
            error.statusCode = 404
            throw error;
        }
        return {
            total,
            totalPage,
            currentPage: parseInt(page),
            sortBy,
            sort,
            tours,
            limit
        }
    } catch (err) {
        const error = new Error(err.message);
        error.status = "ERROR"
        throw error;
    }
}

const getOneTour = async (params) => {
    try {
        const id = params.id || null
        if (!id) {
            const error = new Error("The input in required");
            error.status = "ERROR"
            error.statusCode = 400
            throw error;
        }
        const tour = await tourModel.findOne({ _id: id }).populate('category')

        if (!tour) {
            const error = new Error("Not found tour!");
            error.status = "ERROR"
            error.statusCode = 404
            throw error;
        }
        return tour
    } catch (err) {
        const error = new Error(err.message);
        error.status = "ERROR"
        throw error;
    }
}
const deleteOneTour = async (id) => {
    try {

        if (!id) {
            const error = new Error("The input in required");
            error.status = "ERROR"
            error.statusCode = 400
            throw error;
        }
        //Xóa tất cả booking của tour này
        await bookingModel.deleteMany({
            tour_id: new mongoose.Types.ObjectId(id)
        })
        return await tourModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
    } catch (err) {
        const error = new Error(err.message)
        err.status = "ERROR"
        throw error
    }
}
const updateOneTour = async (params, body) => {
    try {
        const id = params.id || null
        const { tour_code } = body

        const validId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
        if (!validId) {
            const error = new Error("Invalid ID format");
            error.status = "ERROR";
            error.statusCode = 400
            throw error;
        }
        const tour = await tourModel.findOne({
            tour_code: tour_code,
            _id: { $ne: validId }
        })
        if (tour) {
            const error = new Error('Trùng giá trị tour code!');
            error.status = "ERROR"
            error.statusCode = 400; // Bad Request
            throw error;
        }

        let updated = await tourModel.findByIdAndUpdate(validId, body, { new: true })
        return await updated.populate('category')

    } catch (err) {
        const error = new Error(err.message)
        err.status = "ERROR"
        throw error
    }
}
const getFiveMainTour = async () => {
    try {

        // Bước 3: Truy vấn thông tin chi tiết của các tour
        const tours = await tourModel
            .find()
            .limit(5)
            .sort("createdAt desc")

        return tours;

    } catch (err) {
        const error = new Error(err.message)
        err.status = "ERROR"
        throw error
    }
}
module.exports = {
    createTour,
    getAllTour,
    getOneTour,
    deleteOneTour,
    updateOneTour,
    getFiveMainTour
}