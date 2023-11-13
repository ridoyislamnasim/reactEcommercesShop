const express = require("express");
const JWT = require("jsonwebtoken");
// import registrationschema from "../../models/auth/registration";

//Protected Routes token base
const requireSignIn = async (req, res, next) => {
    console.log("token --", req.headers.authorization)
    console.log("------------", process.env.JWT_SECRET)

    try {
        console.log("------------")
        if (!req.headers.authorization) {
            res.status(401).json({ errorMsg: "Unauthorized: Missing Authorization token in header" });
        }
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        console.log("------------", decode)
        req.user = decode;
        next();
    } catch (error) {
        console.log('--'.error);
    }
};
module.exports = {
    requireSignIn,
};