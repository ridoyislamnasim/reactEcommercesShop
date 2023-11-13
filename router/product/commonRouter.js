const express = require("express");
const common = express.Router();
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
const { filter, getCategoryProductController } = require("../../controller/common/controller/filterController");
const { getSingleProductController, getSimilarProductController } = require("../../controller/admin/product/productsContrpller");
const { orderProduct, allOrderController, orderStatusController } = require("../../controller/order/orderController");


// ======================  ======================
common.post('/filter',
    // singinValidators,
    filter
);
// ====================== product get with similar product (cp=current product id) (ca= catrgory id) ======================
common.get('/product/:cp_id/:ca_id',
    getSimilarProductController,
);
// ====================== product get with category wise  ======================
common.get('/product/:category_id',
    // isUnAuthenticated,
    getCategoryProductController,
);
// ======================  ======================
common.get('/order',
    // isUnAuthenticated,
    requireSignIn,
    orderProduct
);
// ====================== admin all order get ======================
common.get('/all-order',
    // isUnAuthenticated,
    requireSignIn,
    allOrderController
);
// ====================== admin update order status ======================
common.put('/update-order-status/:id',
    // isUnAuthenticated,
    requireSignIn,
    orderStatusController
);

module.exports = common;