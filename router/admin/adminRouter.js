const express = require("express");
const admin = express.Router();
const mongoose = require("mongoose");



// / internal imports
// controller
const { registration } = require("../../controller/auth/registrationController");
const { login } = require("../../controller/auth/loginController");
const { createCategoryController,
    updateCategoryController,
    getAllCategoryController,
    deleteCategoryController } = require("../../controller/admin/category/categoryController");
const { createProductController,
    updateProductController,
    getAllProductController,
    deleteProductController,
    getSingleProductController } = require("../../controller/admin/product/productsContrpller");

// const { upload } = require("../../controller/admin/product/productImg");
const uploadMiddleware = require("../../midelware/admin/fileUpload/productUpload");

//validator 
// const { singinValidators } = require("../../validator/auth/registrationStudentValidator");
// const { singinValidatorsEmployee } = require("../../validator/auth/registrationEmployeeValidator");
// const Schema = mongoose.Schema

//middleWare
const { requireSignIn } = require("../../midelware/auth/authMidelware");


// ===================================================
// Category
// ===================================================
admin.post('/create-category',
    // requireSignIn,
    createCategoryController
);
admin.put('/update-category/:id',
    // requireSignIn,
    updateCategoryController
);
admin.get('/category',
    // requireSignIn,
    getAllCategoryController
);
// admin.get('/single-category',
//     requireSignIn,
//     singleCategory
// );
admin.delete('/delete-category/:id',
    requireSignIn,
    deleteCategoryController
);
// ===================================================
// product
// ===================================================
admin.post('/create-product',
    // requireSignIn,
    uploadMiddleware,
    createProductController
);
admin.put('/update-product/:id',
    // requireSignIn,
    uploadMiddleware,
    updateProductController
);
admin.delete('/delete-product/:id',
    deleteProductController
);
admin.get('/products',
    getAllProductController
);
admin.get('/product/:id',
    getSingleProductController
);





// admin.post("/:id",editroom);

// // delete the data by id 
// admin.get("/delete/:id",deleteroom);

module.exports = admin;