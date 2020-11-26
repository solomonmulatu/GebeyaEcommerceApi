const express = require('express');
const router = new express.Router();


const {userAuthentication} = require('../../controllers/AuthController/auth.controller');

// @route      POST api/users/login
// @desc       User Login
// @access     Public
router.post('/login',userAuthentication);







module.exports = router;
