
const {check, validationResult} = require('express-validator');

//region Check if the necessary fields are provided
const loginValidationRuleToCheckEmptyFields = () => {
    return [
        check('email').notEmpty().withMessage('Email is Required'),
        check('password').notEmpty().withMessage('Password Is Required')

        // endregion
    ]
};
module.exports = {
    loginValidationRuleToCheckEmptyFields
};
