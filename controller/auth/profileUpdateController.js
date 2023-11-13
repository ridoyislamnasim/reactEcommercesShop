const express = require("express");
const bcrypt = require("bcrypt")
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// internal imports
const registrationschema = require("../../models/auth/registration");
const { hashPassword } = require("../common/function/common")

// console.log("now");

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}
profileUpdate = async (req, res) => {
    console.log("req.body")
    console.log(req.body)
    const { name, email, password, phone, address } = req.body;

    if (!email || email.trim() === '') {
        res.json({ errorMsg: "email is required" });
    } else if (!password || password.trim() === '') {
        res.json({ errorMsg: "password is required" });
    } else {
        try {
            // Check if the email exists in the database
            const user = await registrationschema.findOne({ email });

            if (!user) {
                console.log('title');
                return res.json({ success: false, errorMsg: 'Invalid credentials' });
            }

            // Compare the provided password with the hashed password in the database
            console.log('user.password', user.password);
            const hashedPassword = await hashPassword(user.password)
            const passwordMatch = await bcrypt.compare(password, hashedPassword);
            console.log('passwordMatch', passwordMatch);
            if (!passwordMatch) {
                console.log('title --2');
                return res.json({ success: false, errorMsg: 'Invalid credentials' });
            }
            let updateUser
            console.log('user', user);
            if (!user) {
                // User not found or password doesn't match
                return res.status(401).json({ success: false, errorMsg: 'Invalid credentials' });
            } else {
                updateUser = await registrationschema.findByIdAndUpdate(user._id, {
                    name: name,
                    email: email || user.email,
                    password: password || user.password,
                    phone: phone || user.phone,
                    address: address || user.address,
                }, { new: true })
            }
            console.log('updateUser', updateUser);
            if (updateUser) {
                res.status(200).json({
                    success: true,
                    updateUser,
                    message: "Update successful."
                });
            } else {
                console.log("Failed to profileUpdate Update .");
                res.status(401).json({
                    success: false,
                    errorMsg: "Failed to profile Update ."
                });
            }

        } catch (error) {
            console.error("Error occurred during profileUpdate:", error);
            res.json({
                success: false,
                errorMsg: "Internal server error occurred during profileUpdate."
            });
        }

    }


}
module.exports = {
    profileUpdate,
};