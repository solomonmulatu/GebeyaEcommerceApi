const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

// region User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Your can not contain the word '" + value);
            }
        }
    },
    //
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});
// endregion


// region Convert data to user object and remove private data
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
};
// endregion

// region userSchema Method that can be accessed from User individual instance
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({"_id": user._id.toString()}, "123456789");
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
};
// endregion

// region userSchema Method that can be accessed from User individual instance
userSchema.statics.getSelectedUser = async function (req, res) {
    await User.find({userParentId: req.user.id}, function (err, data) {
        if (data.length) {
            res.status(200).json(data);
        } else {
            res.status(400).json({errors: [{msg: 'There Are No users Registered by Yourself'}]});
        }
    }).sort({'createdAt': 'desc'}).populate('userType').populate('account').populate('userParentId');
};
// endregion

// region userSchema Method that can be accessed Single user info
userSchema.statics.getUser = async function (req, res) {
    await User.find({_id: req.body.user_id}, function (err, data) {
        if (data.length) {
            console.log(data)
            res.status(200).json(data);
        } else {
            res.status(400).json({errors: [{msg: 'There is No users'}]});
        }
    }).populate('userType');
};
// endregion


// region userSchema Method that can be accessed directly from User
userSchema.statics.findByCredentials = async (req, res, email, password) => {
    const user = await User.findOne({email}).populate('userType');
    if (!user) {
        await res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        await res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
    }

    return user;
};
// endregion



// region Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});
// endregion



const User = mongoose.model('User', userSchema);

module.exports = User;
