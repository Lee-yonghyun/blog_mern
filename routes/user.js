const express = require('express')
const router = express.Router()
const userModel = require('../models/user')



// @route   POST http://localhost:6000/users/registor
// @desc    Registor user
// @access  Public

router.post('/registor',(req,res) => {

    const { name, email, password } = req.body

    const newUser = new userModel({
        name, email, password
    })

    newUser
        .save()
        .then(user => {
            res.json({
                message:'saved userdata',
                userInfo: user
            })
        })
        .catch(err => {
            res.json({
                message:err.message
            })
        })

})




// @route   POST http://localhost:6000/users/login
// @desc    login user & get token
// @access  Public

router.post('/login',(req,res) => {


})



module.exports = router