import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: Array,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    inStock: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
},
    {
        timestamps: true,
    });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;