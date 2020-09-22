const express = require('express')
const router = express.Router()
const {
    register_user,
    login_user
} = require('../controller/user')
const userModel = require('../models/user')

const passport =  require('passport')
const checkAuth = passport.authenticate("jwt", {session:false})




// @route   POST http://localhost:6000/users/register
// @desc    Register user
// @access  Public

router.post('/register',register_user)



// @route   POST http://localhost:6000/users/login
// @desc    login user & get token
// @access  Public

router.post('/login',login_user)




//@route    GET http://localhost:6000/users/current
//@desc     get current userinfo
//@access   Private
router.get('/current', checkAuth,(req,res) => {

    console.log(req.user)
    //payload의 형식, 발행된 jwt의 형식과 일치 but, usermodel에서 가져오는 것!
    res.json({
        id:req.user.id,
        email:req.user.email,
        name:req.user.name,
        avatar:req.user.avatar,
        // password:req.user.password
    })
})





//@route    GET http://localhost:6000/users/all
//@desc     get all userinfo
//@access   Private
router.get('/all',checkAuth, (req,res) => {

    userModel
        .findById(req.user.id)
        .then(user => {

            if(user.role !== "admin") {
                return res.json({
                    message:"you are not admin"
                })
            }

            else {
                userModel
                    .find()
                    .then(users => res.json(users))
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
})


module.exports = router