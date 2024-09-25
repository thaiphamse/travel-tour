const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
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

const category = mongoose.model("Category", categorySchema);
module.exports = category;
