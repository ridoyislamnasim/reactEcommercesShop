// username ,useremail,password,confirmpassword

const mongoose = require("mongoose");
const Schema = mongoose.Schema
const categorySchema = new Schema(
    {
        category: {
            type: String,
            // required: true,
            // trim: true,
            // unique: true,
        },
        slug: {
            type: String,
            // lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);
// databaseTable name , schema name 
const categoryschema = mongoose.model("categoryInfo", categorySchema);

module.exports = categoryschema;