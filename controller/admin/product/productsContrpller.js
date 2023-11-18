const fs = require("fs")

// const registrationschema = require("../../models/auth/registration");
// model
const productschema = require("../../../models/product/productModel");

const { createSlug, removeSlug } = require("../../common/function/common");
const mongoose = require("mongoose");
// remove image in file system
const removeLocalImage = async (imagePath) => {
    // const imagePath = req.file.path;
    console.log('remove =============', imagePath);
    const removePath = `public/uploads/${imagePath}`
    console.log('removePath', removePath);

    try {
        if (fs.existsSync(removePath)) {
            fs.unlinkSync(removePath);
        }
        console.log("========= delteed")
    } catch (error) {
        console.log("=====not delteed")
    }
}
// convert To Boolean
const convertToBoolean = async (value) => {
    const trueValues = ['1', 'true', 'yes', 'Yes', 'on', 'enabled', 'active', true];
    const falseValues = ['0', 'false', 'no', 'No', 'off', 'disabled', 'inactive', false];

    if (trueValues.includes(value)) {
        return true;
    } else if (falseValues.includes(value)) {
        return false;
    } else {
        // Default to false if the input is not recognized as a true value
        return false;
    }
}
// if img remove need than call this function

// =========================== createProductController===========================
createProductController = async (req, res) => {
    console.log("req.body")
    console.log(req.body)
    const fields = { ...req.body }
    const imagePath = req.file.path
    console.log(imagePath)
    console.log("------------------------------------------------------", req.file)
    // const { category } = req.body;
    if (!fields.name || fields.name.trim() === '') {
        await removeLocalImage(req.file.filename)
        res.json({ errorMsg: "name is required" });
    } else if (!fields.price || fields.price.trim() === '') {
        await removeLocalImage(req.file.filename)
        res.json({ errorMsg: "price is required" });
    } else if (!fields.quantity || fields.quantity.trim() === '') {
        await removeLocalImage(req.file.filename)
        res.json({ errorMsg: "quantity is required" });
    }
    // else if (!fields.shipping || fields.shipping.trim() === '') {
    //     res.json({ errorMsg: "shipping is required" });
    // } 
    else if (!fields.category || fields.category.trim() === '') {
        await removeLocalImage(req.file.filename)
        res.json({ errorMsg: "category is required" });
    } else if (!fields.description || fields.description.trim() === '') {
        await removeLocalImage(req.file.filename)
        res.json({ errorMsg: "description is required" });
    } else {
        try {
            // Check if the email exists in the database
            const productName = fields.name
            const existsProduct = await productschema.findOne({ name: productName });

            if (existsProduct) {
                await removeLocalImage(req.file.filename)
                return res.json({ success: false, errorMsg: 'Product already exits' });
            }
            const slug = await createSlug(productName)

            const shippingBoolean = await convertToBoolean(fields.shipping)
            console.log(shippingBoolean)
            try {
                const createNewProduct = new productschema({
                    ...fields,
                    shipping: shippingBoolean,
                    slug: slug,
                    image: `/uploads/${req.file.filename}`
                });
                const saveProduct = await createNewProduct.save()
                // let savefile = `http://localhost:2000/uploads/${fileName}`

                // Convert the Mongoose document to a plain JavaScript object
                const plainProduct = saveProduct.toObject();

                if (saveProduct) {
                    // Extract only the required fields
                    const { name, slug, description, quantity, photo } = saveProduct;
                    const Extract = {
                        ...plainProduct,
                        image: saveProduct.image
                    }
                    // Login successful
                    res.json({ success: true, message: 'Product Create successful', data: Extract });
                }
            } catch (error) {
                console.log("===========================================================================================", req.file.path)
                await removeLocalImage(req.file.filename)
                console.error('Error:', error);
                res.json({ success: false, errorMsg: 'Internal server error occurred save' });

            }

        } catch (error) {
            console.log("===========================================================================================", req.file.path)
            await removeLocalImage(req.file.filename)
            console.error('Error:', error);
            res.json({ success: false, errorMsg: 'Internal server error occurred' });
        }

    }




}
// =========================== updateProductController===========================
updateProductController = async (req, res) => {
    console.log("req.body")
    console.log(req.body)
    // console.log(req.uploadedFiles)
    const fields = { ...req.body }
    // const { category } = req.body;
    if (!fields.name || fields.name.trim() === '') {
        await removeLocalImage(req?.file?.path)
        res.json({ errorMsg: "name is required" });
    } else if (!fields.price || fields.price.trim() === '') {
        await removeLocalImage(req?.file?.path)
        res.json({ errorMsg: "price is required" });
    } else if (!fields.quantity || fields.quantity.trim() === '') {
        await removeLocalImage(req?.file?.path)
        res.json({ errorMsg: "quantity is required" });
    }
    // else if (!fields.shipping || fields.shipping.trim() === '') {
    //     res.json({ errorMsg: "shipping is required" });
    // } 
    else if (!fields.category || fields.category.trim() === '') {
        await removeLocalImage(req?.file?.path)
        res.json({ errorMsg: "category is required" });
    } else if (!fields.description || fields.description.trim() === '') {
        await removeLocalImage(req?.file?.path)
        res.json({ errorMsg: "description is required" });
    } else {
        try {
            const productName = fields.name
            const productId = req.params.id
            console.log('productId', productId);
            // Check  the product id exists in the database
            try {
                await productschema.findById(productId);
            } catch (error) {
                await removeLocalImage(req?.file?.path)
                return res.json({ success: false, errorMsg: 'Product id  dose not exits' });
            }
            // Check  same product exists in the database
            try {
                const existsProduct = await productschema.find({ name: productName });
                // length gater than 0 must this product exit
                if (existsProduct.length > 1) {
                    await removeLocalImage(req.file.path)
                    return res.json({ success: false, errorMsg: 'Product already exits' });
                } else if (existsProduct.length == 0) {

                } else {
                    const oneProduct = await productschema.find({ _id: productId, name: productName });
                    //this id update this id product name same langth 1 
                    console.log("oneProduct", oneProduct.length)
                    if (oneProduct.length == 0) {
                        await removeLocalImage(req.file.path)
                        return res.json({ success: false, errorMsg: 'Product already exits same' });
                    }
                }
            } catch (error) {
                console.log("=existsProduct=== not find")
            }
            // update product
            try {
                const slug = await createSlug(productName)
                const shippingBoolean = await convertToBoolean(fields.shipping)
                console.log('shippingBoolean', shippingBoolean);
                // console.log('fields?.image', fields?.image);
                // console.log('fields?.image', req?.uploadedFiles?.[0]);
                let image
                if (fields?.image) {
                    const parts = fields?.image.split('/');
                    const filename = parts[parts.length - 1];
                    image = `/uploads/${filename}`
                    console.log('image', image);
                } else {
                    image = `/uploads/${req.file.filename}`
                }
                const updateProduct = await productschema.findByIdAndUpdate(productId,
                    {
                        ...fields,
                        shipping: shippingBoolean,
                        slug: slug,
                        image: image
                    })
                if (fields?.image) {
                } else {
                    console.log('title-------------------------------');
                    console.log("updateProduct==============", updateProduct)
                    await removeLocalImage(updateProduct.image)
                }

                // let savefile = `http://localhost:2000/uploads/${fileName}`

                // Convert the Mongoose document to a plain JavaScript object
                console.log('updateProduct', updateProduct);
                const nowUpdateProduct = await productschema.findById(productId)
                const plainProduct = nowUpdateProduct.toObject();

                if (nowUpdateProduct) {
                    // Extract only the required fields
                    const Extract = {
                        ...plainProduct,
                        image: nowUpdateProduct.image
                    }
                    console.log('Extract', Extract);
                    // update successful
                    return res.json({ success: true, message: 'Product update successful', data: Extract });
                }
            } catch (error) {
                console.error('Error:', error);
                console.log("===========================================================================================", req.file.path)
                var parts = req.file.path.split('\\');
                var last_part = parts[parts.length - 1];
                console.log('last_part', last_part);
                await removeLocalImage(last_part)
                res.json({ success: false, errorMsg: 'Internal server error occurred save' });

            }

        } catch (error) {
            console.log("===========================================================================================", req.file.path)
            await removeLocalImage(req?.file?.path)
            // try { await fsPromises.unlink(`public/${req.file.path}`) } catch (e) { console.log('not remove', e) }

            console.error('Error:', error);
            res.json({ success: false, errorMsg: 'Internal server error occurred' });
        }

    }

}
// =========================== getAllProductController===========================
getAllProductController = async (req, res) => {
    // Check if the email exists in the database  
    try {
        // .limit(12)
        const AllProduct = await productschema.find().sort({ updatedAt: -1 }).populate("category");
        if (AllProduct.length > 0) {
            const Extract = []
            for (const product of AllProduct) {
                const plainProduct = product.toObject();
                let singleProduct = {
                    ...plainProduct,
                    image: plainProduct.image
                }
                Extract.push(singleProduct)
            }
            // Login successful
            return res.json({ success: true, message: 'get Product successful', data: Extract, tptalProduct: AllProduct.length });
        }
        res.json({ success: false, errorMsg: 'no any Product in DB' });
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, errorMsg: 'Internal server error occurred' });

    }
}
// =========================== getSingleProductController===========================
getSingleProductController = async (req, res) => {
    // Check if the email exists in the database  
    const { id } = req.params;
    console.log('id', id);
    try {

        const Product = await productschema.findById(id).populate("category");
        console.log('Product', Product);
        if (Product !== null) {
            const plainProduct = Product.toObject();
            let singleProduct = {
                ...plainProduct,
                image: plainProduct.image
            }

            // Login successful
            return res.json({ success: true, message: 'get Product successful', data: singleProduct });
        }
        res.json({ success: false, errorMsg: 'no any Product' });
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, errorMsg: 'Internal server error occurred' });

    }
}
// =========================== getSimilarProductController===========================
getSimilarProductController = async (req, res) => {
    // Check if the email exists in the database  
    const { cp_id, ca_id } = req.params;
    console.log('id', cp_id, ca_id);
    try {

        const AllProduct = await productschema
            .find({ category: ca_id, _id: { $nin: [cp_id] } })
            .limit(4)
            .populate("category");

        console.log('Product', AllProduct);
        if (AllProduct !== null && AllProduct.length > 0) {
            const Extract = []
            for (const product of AllProduct) {
                const plainProduct = product.toObject();
                let singleProduct = {
                    ...plainProduct,
                    image: plainProduct.image
                }
                Extract.push(singleProduct)
            }
            console.log('Extract====similiar product ============', Extract);
            console.log('===========similiar product ============');
            // Login successful
            return res.json({ success: true, message: 'get Product successful', data: Extract });
        }
        res.json({ success: false, errorMsg: 'no any Product' });
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, errorMsg: 'Internal server error occurred' });

    }
}
// =========================== deleteProductController===========================
deleteProductController = async (req, res) => {
    const { id } = req.params;
    // const deleteProduct = await productschema.findByIdAndDelete(id);
    // console.log("deleteProduct", deleteProduct)
    try {
        const deleteProduct = await productschema.findByIdAndDelete(id);
        if (deleteProduct === null) {
            return res.json({ success: false, message: 'Product not found. Deletion unsuccessful', });
        }
        // Delete successful
        await removeLocalImage(deleteProduct.image)
        res.json({ success: true, message: 'Delete Product successful', data: deleteProduct });

    } catch (error) {
        console.error('Error:', error);
        return res.json({ success: false, errorMsg: 'Internal server error occurred' });

    }

}

module.exports = {
    createProductController,
    updateProductController,
    getAllProductController,
    getSingleProductController,
    getSimilarProductController,
    deleteProductController
};