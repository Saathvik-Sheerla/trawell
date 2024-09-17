const { required } = require('joi');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const reviewSchema = new schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Review', reviewSchema);