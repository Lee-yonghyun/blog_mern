const express = require('express')
const router = express.Router()
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')




// @route   POST http://localhost:6000/users/registor
// @desc    Registor user
// @access  Public

router.post('/registor',(req,res) => {

    const { name, email, password } = req.body


    userModel
        .findOne({email})
        .then(user => {
            console.log(user)

            if (user) {
                return res.json({
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
})




// @route   POST http://localhost:6000/users/login
// @desc    login user & get token
// @access  Public

router.post('/login',(req,res) => {

    const {name , email, password} = req.body

    userModel
        .findOne({email})
        .then(user => {

            if (!user) {
                return res.json({
                    message:'your email wrong'
                })
            }

            else{

                bcrypt.compare(password, user.password, (err,result) => {

                  if (err || result === false) {
                      return res.json({
                          success:result,
                          message:'password incorrect'
                      })
                  }
                  else {
                      const token = jwt.sign(
                          {email:user.email, userId:user._id},
                          "key",
                          {expiresIn:"1d"}
                      )

                      res.json({
                          success:result,
                          token:token
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


})



module.exports = router