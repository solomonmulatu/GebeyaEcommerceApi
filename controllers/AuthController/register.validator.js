
const {check, validationResult} = require('express-validator');

//region Check if the necessary fields are provided
const registerValidationRuleToCheckEmptyFields = () => {
    return [
        check('name').notEmpty().withMessage('Name is Required'),
        check('email').notEmpty().withMessage('Email Is Required'),
        check('password').notEmpty().withMessage('Password Is Required'),



        // endregion
    ]
};
module.exports = {
    registerValidationRuleToCheckEmptyFields
};
