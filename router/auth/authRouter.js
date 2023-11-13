const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");



// / internal imports
// controller
// const roomschem= require("../models/users"); 
const { registration } = require("../../controller/auth/registrationController");
const { login } = require("../../controller/auth/loginController");
const { forgetPassword } = require("../../controller/auth/forgetPasswordController");

//validator 
// const { singinValidators } = require("../../validator/auth/registrationStudentValidator");
// const { singinValidatorsEmployee } = require("../../validator/auth/registrationEmployeeValidator");
// const Schema = mongoose.Schema

//middleWare
const { requireSignIn } = require("../../midelware/auth/authMidelware");
const { profileUpdate } = require("../../controller/auth/profileUpdateController");
const { paymentToknController, paymentController } = require("../../controller/payment/paymentController");



router.post('/registrations',
    // isUnAuthenticated,
    // singinValidators,
    registration
);
router.post('/login',
    // isUnAuthenticated,
    // singinValidators,
    login
);
router.get('/auth',
    // isUnAuthenticated,
    requireSignIn,
    (req, res) => res.status(200).json({ isAuthenticated: true })

);

router.post('/forgetPassword',
    // isUnAuthenticated,
    // singinValidators,
    forgetPassword
);
router.post('/profile-update',
    // isUnAuthenticated,
    // singinValidators,
    profileUpdate
);

// payment route 
router.get('/payment/token',
    // isUnAuthenticated,
    // singinValidators,
    paymentToknController
);
router.post('/payment',
    // isUnAuthenticated,
    requireSignIn,
    paymentController
);

module.exports = router;