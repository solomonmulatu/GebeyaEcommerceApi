const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var itemSchema = new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Product'
    },
    qty: {
        type: Number,
        required: true
    }
});
const cartSchema = new Schema({
    user_id: {
        type: String,
        required: true,

    },
    items: [itemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cart', cartSchema);