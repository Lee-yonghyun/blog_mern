const express = require('express')
const router = express.Router()
const {
    register_user,
    login_user,
    current_user,
    all_user
} = require('../controller/user')
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const passport =  require('passport')
const checkAuth = passport.authenticate("jwt", {session:false})

const {
    validationSignup,
    validationLogin
} = require('../helpers/validation')




// @route   POST http://localhost:6000/users/register
// @desc    Register user
// @access  Public
router.post('/register',validationSignup,register_user)


//@route    POST http://localhost:6000/users/activation
//@desc     Activation account from confirm email
//@access   Private
router.post('/activation', (req,res) => {

    const {token} = req.body //token : req.body.token

    if(token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, result) => {

            //토큰이 유효하지 않을떄
            if(err) {
                return res.status(401).json({
                    error:"만료된 링크입니다.  다시 등록해주세요"
                })
            }
            //토큰이 유효할 때 -> 유저 등록절차 진행
            else {
                const {name, email, password } = jwt.decode(token)

                console.log("jwt.decode",jwt.decode(token))

                const newUser = new userModel({
                    name, email, password
                })

                console.log("userInfo", newUser)

                newUser
                    .save()
                    .then(user => {
                        res.status(200).json({
                            message:"successful sign up",
                            userInfo: user
                        })
                    })
                    .catch(err => {
                        return res.status(400).json({
                            message:err.message
                        })
                    })
            }
        })

    }

})


// @route   POST http://localhost:6000/users/login
// @desc    login user & get token
// @access  Public
router.post('/login',validationLogin,login_user)




//@route    GET http://localhost:6000/users/current
//@desc     get current userinfo
//@access   Private
router.get('/current', checkAuth, current_user)





//@route    GET http://localhost:6000/users/all
//@desc     get all userinfo
//@access   Private
router.get('/all',checkAuth, all_user)


module.exports = router