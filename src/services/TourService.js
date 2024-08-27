const tourModel = require('../models/TourModel')
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
        start_date,
        end_date,
        hodel_level,
        schedules } = tourData

    if (!tour_code ||
        !name ||
        !description ||
        !shedule_on_week ||
        !transportation ||
        !start_location ||
        !end_location ||
        !start_date ||
        !end_date) {

        const error = new Error('The input in required!');
        error.status = "ERROR"
        error.statusCode = 400; // Bad Request
        throw error;
    }
    const tour = await tourModel.findOne({ tour_code: tour_code })
    if (tour) {
        const error = new Error('Trùng giá trị tour code!');
        error.status = "ERROR"
        error.statusCode = 400; // Bad Request
        throw error;
    }
    return await tourModel.create({
        tour_code,
        name,
        description,
        shedule_on_week,
        transportation,
        start_location,
        end_location,
        base_price_adult,
        base_price_child,
        start_date,
        end_date,
        hodel_level,
        schedules
    })
}
module.exports = {
    createTour
}