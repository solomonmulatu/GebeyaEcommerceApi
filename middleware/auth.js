const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');


module.exports = async (req, res, next) => {


    try {

        const token = req.header('x-auth-token');
        const decoded = await jwt.verify(token, config.get('jwtSecret'));
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})


        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();

    } catch (e) {

        res.status(401).json({msg: 'Token is not valid'});
    }
};
