
const express = require("express");
var braintree = require("braintree");
require('dotenv').config();
const productschema = require("../../models/product/productModel");
const orderschema = require("../../models/order/orderModel");

//payment gateway
console.log('process.env.COOKIE_SECRET', process.env.MONGO_CONNECTION_STRING);
console.log('process.env.BRAINTREE_MERCHANT_ID', process.env.JWT_EXPIRY);
console.log('process.env.BRAINTREE_MERCHANT_ID', process.env.BRAINTREE_MERCHANT_ID);
console.log('process.env.BRAINTREE_MERCHANT_ID', process.env.BRAINTREE_PUBLIC_KEY);
console.log('process.env.BRAINTREE_MERCHANT_ID', process.env.BRAINTREE_PRIVATE_KEY);

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//payment gateway api
//token
paymentToknController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

// payment Controller
paymentController = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        console.log('cart', cart);
        console.log('cart------');
        console.log('cart', cart[0]._id, req.user);
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    const order = new orderschema({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};

//payment gateway api
//token
// braintreeTokenController = async (req, res) => {
//     try {
//         gateway.clientToken.generate({}, function (err, response) {
//             if (err) {
//                 res.status(500).send(err);
//             } else {
//                 res.send(response);
//             }
//         });
//     } catch (error) {
//         console.log(error);
//     }
// };

// //payment
// brainTreePaymentController = async (req, res) => {
//     try {
//         const { nonce, cart } = req.body;
//         let total = 0;
//         cart.map((i) => {
//             total += i.price;
//         });
//         let newTransaction = gateway.transaction.sale(
//             {
//                 amount: total,
//                 paymentMethodNonce: nonce,
//                 options: {
//                     submitForSettlement: true,
//                 },
//             },
//             function (error, result) {
//                 if (result) {
//                     const order = new orderModel({
//                         products: cart,
//                         payment: result,
//                         buyer: req.user._id,
//                     }).save();
//                     res.json({ ok: true });
//                 } else {
//                     res.status(500).send(error);
//                 }
//             }
//         );
//     } catch (error) {
//         console.log(error);
//     }
// };

module.exports = {
    paymentToknController,
    paymentController
};