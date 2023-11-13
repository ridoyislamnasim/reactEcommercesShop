const express = require("express");
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// internal imports
const registrationschema = require("../../models/auth/registration");
const { hashPassword } = require("../common/function/common")

// console.log("now");

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}
registration = async (req, res) => {
    console.log("req.body")
    console.log(req.body)
    const { name, email, password, phone, address, favoriteSports } = req.body;

    if (!name || name.trim() === '') {
        res.json({ errorMsg: "name is required" });
    } else if (!email || email.trim() === '') {
        res.json({ errorMsg: "email is required" });
    } else if (!password || password.trim() === '') {
        res.json({ errorMsg: "password is required" });
    } else if (!phone || isNaN(Number(phone))) {
        res.json({ errorMsg: "phone is required" });
    } else if (!address || address.trim() === '') {
        res.json({ errorMsg: "address is required" });
    } else {
        try {
            const existingUser = await registrationschema.findOne({ email: email });
            if (existingUser) {
                return res.json({ success: false, errorMsg: "Email already exists. Please choose a different email address." });
            }
            const hashedPassword = await hashPassword(password)
            console.log("hashedPassword", hashedPassword)
            const registrationInfo = new registrationschema({
                ...req.body,
                phone: Number(phone),
                password: hashedPassword
            });

            const user = await registrationInfo.save();
            console.log('-----------------------------------------------')
            console.log(typeof user)
            console.log(user.length)
            if (user) {
                res.json({
                    success: true,
                    user,
                    message: "Registration successful."
                });
            } else {
                console.log("Failed to save registration information.");
                res.json({
                    success: false,
                    errorMsg: "Failed to save registration information."
                });
            }
        } catch (error) {
            console.error("Error occurred during registration:", error);
            res.json({
                success: false,
                errorMsg: "Internal server error occurred during registration."
            });
        }


    }





}


module.exports = {
    registration,
};