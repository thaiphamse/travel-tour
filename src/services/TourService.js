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
        category, provinceId } = tourData


    if (!tour_code ||
        !name ||
        !description ||
        !shedule_on_week ||
        !transportation ||
        !start_location ||
        !end_location ||
        schedules.length === 0 ||
        provinceId.length === 0) {

        const error = new Error('The input in required!');
        error.status = 400
        throw error;
    }
    if (category) {
        const validId = mongoose.Types.ObjectId.isValid(category) ? new mongoose.Types.ObjectId(category) : null;
        if (!validId) {
            const error = new Error("Invalid category ID format");
            error.status = 400
            throw error;
        }
    }
    let categoryDb = await categoryTour.findOne({ _id: category })
    if (!categoryDb) {
        const error = new Error("Category is not found");
        error.status = 404
        throw error;
    }
    const tour = await tourModel.findOne({ tour_code: tour_code })
    if (tour) {
        const error = new Error('Trùng giá trị tour code!');
        error.status = 400
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
        category,
        provinceId
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
    const category = query.category || null
    const filter = {}
    const skip = (page - 1) * limit;

    // Lọc theo id tỉnh
    if (provinceId) {
        filter.provinceId = provinceId
    }

    // Lọc theo tên
    if (name)
        filter.name = { $regex: name, $options: 'i' };

    if (category)
        filter.category = category;

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
            return {
                total,
                totalPage,
                currentPage: parseInt(page),
                sortBy,
                sort,
                tours: [],
                limit
            }
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
        throw err;
    }
}

const getOneTour = async (params) => {
    try {
        const id = params.id || null
        if (!id) {
            const error = new Error("The input in required");
            error.status = 400
            throw error;
        }
        const tour = await tourModel
            .findOneAndUpdate(
                { _id: id },
                {
                    $inc: {
                        view: 1
                    }
                },
            )
            .populate('category')

        if (!tour) {
            const error = new Error("Not found tour!");
            error.status = 404
            throw error;
        }
        return tour
    } catch (err) {
        throw err;
    }
}
const deleteOneTour = async (id) => {
    try {

        if (!id) {
            const error = new Error("The input in required");
            error.status = 400
            throw error;
        }
        //Xóa tất cả booking của tour này
        await bookingModel.deleteMany({
            tour_id: new mongoose.Types.ObjectId(id)
        })
        return await tourModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
    } catch (err) {
        throw err
    }
}
const updateOneTour = async (params, body) => {
    try {
        const id = params.id || null
        const { tour_code } = body

        const validId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
        if (!validId) {
            const error = new Error("Invalid ID format");
            error.status = 400
            throw error;
        }
        const tour = await tourModel.findOne({
            tour_code: tour_code,
            _id: { $ne: validId }
        })
        if (tour) {
            const error = new Error('Trùng giá trị tour code!');
            error.status = 400
            throw error;
        }


        let updated = await tourModel.findByIdAndUpdate(validId, body, { new: true })
        if (!updated) {
            const error = new Error('Tour is not found');
            error.status = 404
            throw error;
        }
        return await updated.populate('category')

    } catch (err) {
        throw err
    }
}
const getFiveMainTour = async () => {
    try {

        const tours = await tourModel
            .find()
            .limit(5)
            .sort({ 'view': 'desc' })

        return tours;

    } catch (err) {
        throw err
    }
}
const getImages = async () => {
    try {
        const tours = await tourModel.find({ 'image.type': 'photos' }, { 'image.$': 1 });
        const photos = tours.flatMap(tour => tour.image);

        return photos;

    } catch (err) {
        throw err
    }
}
const getTourSlides = async (query) => {
    try {
        const limit = query.limit || 5

        return await tourModel
            .find({
            })
            .limit(limit)
            .select({
                name: 1,
                base_price_adult: 1,
                category: 1,
                image: { $elemMatch: { type: 'slide' } }
            })
            .populate('category', 'name')
            .sort({ view: 'desc' }); // Sắp xếp theo lượt view giảm dần
    } catch (err) {
        throw err;
    }

}
module.exports = {
    createTour,
    getAllTour,
    getOneTour,
    deleteOneTour,
    updateOneTour,
    getFiveMainTour,
    getImages,
    getTourSlides
}