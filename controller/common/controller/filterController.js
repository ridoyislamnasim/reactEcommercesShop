const express = require("express");
const productschema = require("../../../models/product/productModel");

filter = async (req, res) => {
    console.log("req.body")
    console.log(req.body)
    const { categoryArray, priceRange } = req.body;
    let CategoryArray = [], minPrice, maxPrice
    if (categoryArray.length > 0) CategoryArray = categoryArray
    // console.log('category', category);
    if (priceRange.length > 0) minPrice = priceRange[0], maxPrice = priceRange[1]
    try {
        let query = {};

        if (CategoryArray.length > 0 && (minPrice || maxPrice)) {
            // If both category and price are specified, filter based on both criteria
            query = {
                category: { $in: CategoryArray },
                price: { $gte: minPrice, $lte: maxPrice }
            };
        } else if (CategoryArray.length > 0) {
            // If only category is specified, filter based on category
            query = {
                category: { $in: CategoryArray }
            };
        } else if (minPrice || maxPrice) {
            // If only price is specified, filter based on price
            query = {
                price: { $gte: minPrice, $lte: maxPrice }
            };
        }

        // const filterProduct = await productschema.find({
        //     $or: [
        //         { category: { $in: category }, },
        //         { price: { $gte: gt_price, $lte: lh_price } }
        //     ]
        // }).populate("category")
        const filterProduct = await productschema.find(
            query
        ).populate("category")
        console.log('filterProduct', filterProduct);
        // console.log('filterProduct222', filterProduct2);
        // res.json({ success: true, message: 'find successful', data: filterProduct });

        const Extract = []
        if (filterProduct.length > 0) {

            for (const product of filterProduct) {
                const plainProduct = product.toObject();
                let singleProduct = {
                    ...plainProduct,
                    image: `http://localhost:2000/${plainProduct.image}`
                }
                Extract.push(singleProduct)
            }
            // Login successful
            return res.json({ success: true, message: 'filter  successful', data: Extract, tptalProduct: filterProduct.length });
        }
        res.json({ success: false, errorMsg: 'no any Product in DB', data: Extract, tptalProduct: 0 });
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, errorMsg: 'Internal server error occurred' });
    }






}

// category product show
getCategoryProductController = async (req, res) => {
    console.log("req.body")
    console.log(req.params)
    const { category_id } = req.params;
    try {
        const categoryProduct = await productschema.find(
            { category: category_id }
        ).populate("category")
        console.log('filterProduct', categoryProduct);
        // console.log('filterProduct222', filterProduct2);
        // res.json({ success: true, message: 'find successful', data: filterProduct });

        const Extract = []
        if (categoryProduct.length > 0) {

            for (const product of categoryProduct) {
                const plainProduct = product.toObject();
                let singleProduct = {
                    ...plainProduct,
                    image: `http://localhost:2000/${plainProduct.image}`
                }
                Extract.push(singleProduct)
            }
            // Login successful
            return res.json({ success: true, message: ' successful', data: Extract, totalProduct: categoryProduct.length });
        }
        res.json({ success: false, errorMsg: 'no any Product in DB', data: Extract, totalProduct: 0 });
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, errorMsg: 'Internal server error occurred' });
    }

}
module.exports = {
    filter,
    getCategoryProductController
};