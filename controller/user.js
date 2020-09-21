const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
function tokenGenerator (payload) {
    return jwt.sign(
        payload,
        process.env.SECRETKEY,
        {expiresIn: '1d'}
    )
}

exports.register_user = (req,res) => {

    const { name, email, password } = req.body

    userModel
        .findOne({email})
        .then(user => {
            console.log(user)

            if (user) {
                return res.status(400).json({
                    message:"email already existed"
                })
            }

            else{
                const newUser = new userModel({
                    name, email, password
                })

                newUser
                    .save()
                    .then(user => {
                        res.json({
                            message:'saved data',
                            userInfo:user
                        })
                    })
                    .catch(err => {
                        res.json({
                            message:err.message
                        })
                    })
            }
        })

        .catch(err => {
            res.json({
                message:err.message
            })
        })
}



exports.login_user =  (req,res) => {

    const {name , email, password} = req.body

    userModel
        .findOne({email})
        .then(user => {

            if (!user) {
                return res.json({
                    message:'your email wrong'
                })
            }

            else {

                user.comparePassword(password, (err, result) => {
                    if (err || result === false) {
                        return res.json({
                            message: 'password incorrect'
                        })
                    } else {

                        const payload = {id:user._id, name:user.name, email:user.email, avatar:user.avatar}

                        res.json({
                            success: result,
                            token: tokenGenerator(payload)
                        })
                    }
                })
            }
        })
        .catch(err => {
            res.json({
                message:err.message
            })
        })
}