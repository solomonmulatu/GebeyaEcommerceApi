const mongoose = require('mongoose');

// region Product Schema
const productSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    itemPrice: {
        type: Number,
        required: true,
        default: 0

    },
    itemPicture: {
        type: String,
        required: true,
        trim: true

    },
    itemDescription: {
        type: String,
        required: true,
        trim: true

    },
    itemVendorName: {
        type: String,
        required: true,
        trim: true

    },

}, {
    timestamps: true
});
// endregion





const Product = mongoose.model('Product', productSchema);

module.exports = Product;
