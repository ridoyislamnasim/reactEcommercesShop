const express = require("express");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const fsPromises = require('fs').promises;

const categoryschema = require("../../../models/product/categotyModel");
const productschema = require("../../../models/product/productModel");
const { createSlug, removeSlug } = require("../../common/function/common");
// ==============================function =============================
const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}
// remove image in file system
const removeLocalImage = async (img) => {
    console.log('removeLocalImage ===============', img)
    try { await fsPromises.unlink(`public/${img}`) } catch (e) { console.log('not remove', e) }
}
// =========================== createCategoryController===========================
createCategoryController = async (req, res) => {
    console.log("req.body")
    console.log(req.body)
    const { category } = req.body;
    if (!category || category.trim() === '') {
        res.json({ errorMsg: "name is required" });
    } else {
        try {
            // Check if the email exists in the database
            const existsCategory = await categoryschema.findOne({ category });

            if (existsCategory) {
                return res.json({ success: false, errorMsg: 'Category already exits' });
            }
            const slug = await createSlug(category)
            try {
                const createNewCategory = new categoryschema({
                    category,
                    slug: slug
                });
                const savecategory = await createNewCategory.save()
                if (createNewCategory) {
                    // Login successful
                    res.json({ success: true, message: 'Category Create successful', data: savecategory });
                }
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
// =========================== updateCategoryController===========================
updateCategoryController = async (req, res) => {
    console.log("req.body")
    const { category } = req.body;
    const { id } = req.params;
    console.log(req.body, id)
    if (!category || category.trim() === '') {
        res.json({ errorMsg: "category is required" });
    } else if (!id || id.trim() === '') {
        res.json({ errorMsg: "id is required" });
    } else {
        try {
            // Check if the email exists in the database  
            try {
                const slug = await createSlug(category)
                const updateCategory = await categoryschema.findByIdAndUpdate(id, { category, slug }, { new: true });
                if (updateCategory) {
                    // Login successful
                    res.json({ success: true, message: 'Category Update successful', data: updateCategory });
                }
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
// =========================== getAllCategoryController===========================
getAllCategoryController = async (req, res) => {
    // Check if the email exists in the database  
    try {
        const AllCategory = await categoryschema.find();
        if (AllCategory && AllCategory.length > 0) {
            // Sending a successful response
            res.status(200).json({ success: true, message: 'Received Category information', data: AllCategory });
        } else {
            // Handling the case when no categories are found
            res.status(200).json({ success: false, errorMsg: 'No categories found' });
        }
    } catch (error) {
        // Handling errors (HTTP status code 500 Internal Server Error)
        console.error('Error:', error);
        res.status(500).json({ success: false, errorMsg: 'Internal server error occurred' });
    }
}
// =========================== deleteCategoryController===========================
deleteCategoryController = async (req, res) => {
    // Check if the email exists in the database  
    const { id } = req.params;
    console.log('id-----------', id);
    try {
        const deleteCategory = await categoryschema.findByIdAndDelete(id);
        if (deleteCategory) {
            // Retrieve products to be deleted
            const productDeleteByCategory = await productschema.find({ category: deleteCategory._id })
            console.log('productDeleteByCategory', productDeleteByCategory);
            console.log('productDeleteByCategory', productDeleteByCategory.length);
            // Delete the products

            if (productDeleteByCategory.length > 0) {
                console.log('delete ======================');
                const result = await productschema.deleteMany({ category: deleteCategory._id });
                console.log('delete ======================', result);
                for (const productImgDelete of productDeleteByCategory) {
                    console.log('delete =================deleted=====');
                    console.log('productImgDelete.image', productImgDelete);
                    console.log('productImgDelete.image', productImgDelete.image);
                    await removeLocalImage(productImgDelete.image)
                }
            }
            // Login successful
            res.json({ success: true, message: `Delete Category successful and product aslo Deleted`, data: deleteCategory });
        }
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, errorMsg: 'Internal server error occurred' });

    }

}

module.exports = {
    createCategoryController,
    updateCategoryController,
    getAllCategoryController,
    deleteCategoryController
};