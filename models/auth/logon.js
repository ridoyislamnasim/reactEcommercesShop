// username ,useremail,password,confirmpassword

const mongoose = require("mongoose");
const Schema = mongoose.Schema
const loginSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            // minlength: 5,
            // maxlength: 100,
            required: true,
        },

    },
    {
        timestamps: true,
    }
);
// databaseTable name , schema name 
const loginschema = mongoose.model("loginInfo", loginSchema);

module.exports = loginschema;