const User = require('../../models/User');

//region user authentication
const userAuthentication=async(req,res)=>{

    try {
        const user = await User.findByCredentials(req, res, req.body.email, req.body.password);
        if (user) {
            const token = await user.generateAuthToken();
            res.status(200).send({user, token});
        }
    } catch (error) {
        res.status(500).send('Server error ' + error);
    }
}
//endregion


module.exports = {
    userAuthentication


}
