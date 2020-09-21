const express = require('express')
const router = express.Router()
const {
    register_user,
    login_user
} = require('../controller/user')

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

    //payload의 형식, 발행된 jwt의 형식과 일치
    res.json({
        id:req.user.id,
        email:req.user.email,
        name:req.user.name,
        avatar:req.user.avatar
    })
})


module.exports = router