const express = require("express");
const bcrypt = require("bcrypt");
const registrationschema = require("../../models/auth/registration");
const JWT = require("jsonwebtoken")
const { hashPassword } = require("../common/function/common")
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// internal imports
// const loginschema = require("../../models/auth/login");


// console.log("now");
// const hashPassword = async (password) => {
//     console.log("password", password)
//     try {
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         return hashedPassword
//     } catch (error) {
//         console.log(error)
//     }
// }
const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}
login = async (req, res) => {
    console.log("req.body")
    console.log(req.body)
    const { email, password, } = req.body;
    // Check if the request body contains only 'email' and 'password'
    const hasAdditionalData = Object.keys(req.body).some(key => key !== 'email' && key !== 'password');
    if (hasAdditionalData) {
        return res.status(400).json({ success: false, errorMsg: 'Invalid request. Only email and password are allowed.' });
    }
    if (!email || email.trim() === '') {
        res.json({ errorMsg: "email is required" });
    } else if (!password || password.trim() === '') {
        res.json({ errorMsg: "password is required" });
    } else {
        try {
            // Check if the email exists in the database
            const user = await registrationschema.findOne({ email });

            if (!user) {
                return res.json({ success: false, errorMsg: 'Invalid email or password' });
            }

            // Compare the provided password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.json({ success: false, errorMsg: 'Invalid email or password' });
            }
            // make jsonwebtoken
            const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY })
            // Login successful
            res.json({ success: true, message: 'Login successful', user, token: token });
        } catch (error) {
            console.error('Error:', error);
            res.json({ success: false, errorMsg: 'Internal server error occurred' });
        }

    }





}


module.exports = {
    login,
};