const tourModel = require('../models/TourModel')
const bookingModel = require('../models/BookingModel')

//Tổng doanh thu
//Tổng booking 
const revenueTotal = async () => {
    try {
        const revenueTotal = await bookingModel.aggregate([
            {
                $group: {
                    _id: null,                // Không nhóm theo trường nào, chỉ cần tổng toàn bộ
                    totalRevenue: { $sum: "$total_price" }  // Tính tổng trường totalAmount
                }
            }
        ]);
        return revenueTotal[0].totalRevenue
    } catch (error) {
        throw error
    }
}
//Doanh thu trên tháng
//Tổng booking trên tháng
const revenuePerMonth = async (month, year) => {
    try {
        const startDate = new Date(year, month - 1, 1); // Bắt đầu từ đầu tháng
        const endDate = new Date(year, month, 0);      // Kết thúc ngày cuối cùng của tháng

        const totalRevenue = await bookingModel.aggregate([
            {
                $match: {
                    payment_date: { $gte: startDate, $lte: endDate }  // Lọc theo ngày trong tháng
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$total_price" }  // Tính tổng trường total_price
                }
            }
        ]);
        return totalRevenue.length ? totalRevenue[0].totalRevenue : 0;  // Trả về 0 nếu không có kết quả
    } catch (error) {
        throw error
    }
};

const totalBookingPerMonth = async (month, year) => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const totalBookings = await bookingModel.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }  // Lọc theo ngày
        });

        return totalBookings;
    } catch (error) {
        throw error
    }
};
//Các tour mới thêm trong tháng
const newTourThisMonth = async (month, year) => {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const newTours = await tourModel.find({
            createdAt: { $gte: startDate, $lte: endDate }
        }).count();

        return newTours;
    } catch (error) {
        throw error
    }
}
//Tổng tour
const tourTotal = async () => {
    try {
        const totalTours = await tourModel.countDocuments();
        return totalTours;
    } catch (error) {
        throw error
    }
};

//Tính tổng và các thông số trong tháng hiện tại
const statistical = async () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;  // Tháng (JavaScript trả về từ 0-11 nên cần +1)
    const year = currentDate.getFullYear();    // Năm

    const [
        revenueTotalSum,
        revenue,
        bookings,
        newTours,
        totalTours
    ] = await Promise.all([
        revenueTotal(),
        revenuePerMonth(month, year),     // Doanh thu trên tháng
        totalBookingPerMonth(month, year),// Tổng booking trên tháng
        newTourThisMonth(month, year),    // Các tour mới thêm trong tháng
        tourTotal()                       // Tổng số tour
    ]);

    return {
        'date-statistical': currentDate,
        month: month,
        revenueTotal: revenueTotalSum,
        revenueMonth: revenue,
        bookingMonth: bookings,
        newTourMonth: newTours,
        totalTours
    };

}
module.exports = {
    revenueTotal,
    revenuePerMonth,
    newTourThisMonth,
    tourTotal,
    statistical
}
