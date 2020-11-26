const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/auth');


const {insertItem,updateItem,deleteItem,itemDetail,productList} = require('../../controllers/ProductController/product.controller');
const {addToCart,removeItemFromCart,cartDetail} = require('../../controllers/CartController/cart.controller');



// @route      POST api/product/add
// @desc       Product Registration
// @access     Private
router.post('/add',auth,insertItem)

// @route      PUT api/product/update/:itemId
// @desc       Update Item
// @access     Private
router.put('/update/:itemId',auth, updateItem)

// @route      DELETE api/product/delete/:itemId
// @desc       Delete Item
// @access     Private
router.delete('/delete/:itemId',auth, deleteItem)

// @route      GET api/product/detail/:itemId
// @desc       Get Item Detail
// @access     Private
router.get('/detail/:itemId',auth, itemDetail)

// @route      GET api/product/all
// @desc       Get All Item
// @access     Private
router.get('/all',auth, productList)

// @route      POST api/product/addToCart
// @desc       Add Item To Cart
// @access     Private
router.post('/addToCart',auth, addToCart)


// @route      POST api/product/removeItem
// @desc       Remove Item From Cart
// @access     Private
router.post('/removeItem',auth, removeItemFromCart)

// @route      GET api/product/cartDetail
// @desc       Cart Detail
// @access     Private
router.get('/cartDetail',auth, cartDetail)

module.exports = router;
