const express = require('express')
const router = express.Router()
const {
    register_user,
    login_user
} = require('../controller/user')







// @route   POST http://localhost:6000/users/register
// @desc    Register user
// @access  Public

router.post('/register',register_user)




// @route   POST http://localhost:6000/users/login
// @desc    login user & get token
// @access  Public

router.post('/login',login_user)



module.exports = router