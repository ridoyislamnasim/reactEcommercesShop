// username ,useremail,password,confirmpassword

const mongoose = require("mongoose");
const Schema = mongoose.Schema
const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            // minlength: 5,
            // maxlength: 100,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: mongoose.ObjectId,
            ref: 'categoryInfo',
        },
        quantity: {
            type: Number,
        },
        image: {
            type: String,
            default: 'user',
        },
        shipping: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    }
);
// databaseTable name , schema name 
const productschema = mongoose.model("productInfo", productSchema);

module.exports = productschema;