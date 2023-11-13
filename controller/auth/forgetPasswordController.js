const express = require("express");
const registrationschema = require("../../models/auth/registration");
const JWT = require("jsonwebtoken")
const { hashPassword } = require("../common/function/common")

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}
forgetPassword = async (req, res) => {
    console.log("req.body")
    console.log(req.body)
    const { email, forgetKey, newPassword } = req.body;
    // Check if the request body contains only 'email' and 'password'
    const hasAdditionalData = Object.keys(req.body).some(key => key !== 'email' && key !== 'forgetKey' && key !== 'newPassword');
    if (hasAdditionalData) {
        return res.status(400).json({ success: false, errorMsg: 'Invalid request. Only email, forgetKey and newPassword are allowed.' });
    }
    if (!email || email.trim() === '') {
        res.json({ errorMsg: "email is required" });
    } else if (!forgetKey || String(forgetKey).trim() === '') {
        res.json({ errorMsg: "forgetKey is required" });
    } else if (!newPassword || newPassword.trim() === '') {
        res.json({ errorMsg: "newPassword is required" });
    } else {
        try {
            // Check if the email exists in the database
            const userFind = await registrationschema.findOne({ email, forgetKey });
            console.log(userFind)
            if (!userFind) {
                return res.json({ success: false, errorMsg: 'Invalid email or forgetKey' });
            }
            const hashedPassword = await hashPassword(newPassword)
            try {
                const user = await registrationschema.findByIdAndUpdate({ _id: userFind._id }, { password: hashedPassword })
                res.json({
                    success: true,
                    user,
                    message: "Password Update successful."
                });
            } catch (error) {
                console.error('Error:', error);
                res.json({ success: false, errorMsg: 'Internal server error occurred' });
            }

        } catch (error) {
            console.error('Error:', error);
            res.json({ success: false, errorMsg: 'Internal server error occurred' });
        }

    }





}


module.exports = {
    forgetPassword,
};