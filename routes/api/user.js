const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = new express.Router();
const User = require('../../models/User');
const auth = require('../../middleware/auth');

const {validationResult} = require('express-validator');

const {loginValidationRuleToCheckEmptyFields} = require('../../controllers/AuthController/login.validator');
const {registerValidationRuleToCheckEmptyFields} = require('../../controllers/AuthController/register.validator');


// region User Login
router.post('/login', loginValidationRuleToCheckEmptyFields(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const user = await User.findByCredentials(req, res, req.body.email, req.body.password);
        if (user.status === "locked") {
            await res.status(400).json({errors: [{msg: 'Your account has been locked. Contact your support person to unlock it, then try again.'}]});
        } else {
            const token = await user.generateAuthToken();
            res.status(200).send({user, token});
        }
    } catch (e) {
        res.status(400).send();
    }
});
// endregion


// region Logout
router.post('/logout', auth, async (req, res) => {
    console.log(req.token);
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });
        await req.user.save();
        await res.status(200).json({"response": "success"})
    } catch (e) {
        res.status(500).send();
    }
});
// endregion






// region Create User
router.post('/register', registerValidationRuleToCheckEmptyFields(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let {name, email, password} = req.body;
    let user;
    try {

        let newUserData = {
            name,
            email,
            password
        };

        user = new User(newUserData);
        await user.save();
        try {
            if (user) {

                res.status(201).send({success: [{msg: 'Successfully registered'}]});
            } else {
                res.status(400).send({errors: [{msg: 'Unable to register'}]});
            }


        } catch (e) {
            res.status(400).send({errors: [{msg: e.message}]});
        }


    } catch (e) {
        console.log(e.message)
    }

});
// endregion


module.exports = router;
