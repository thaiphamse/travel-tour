const mongoose = require("mongoose");
const categoryTourSchema = new mongoose.Schema(
    {
        name: { type: String, index: true },
        thumbnail: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const categoryTour = mongoose.model("Category-tour", categoryTourSchema);
module.exports = categoryTour;
