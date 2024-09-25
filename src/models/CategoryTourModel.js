const mongoose = require("mongoose");
const categoryTourSchema = new mongoose.Schema(
    {
        name: { type: String, index: true },
        description: String,
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
