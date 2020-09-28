const express = require('express')
const router = express.Router()
const {
    register_user,
    login_user,
    current_user,
    all_user
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
router.get('/current', checkAuth, current_user)





//@route    GET http://localhost:6000/users/all
//@desc     get all userinfo
//@access   Private
router.get('/all',checkAuth, all_user)


module.exports = router