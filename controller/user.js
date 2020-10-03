const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.MAIL_KEY)
const { validationResult } = require('express-validator')

function tokenGenerator (payload) {
    return jwt.sign(
        payload,
        process.env.SECRETKEY,
        {expiresIn: '1d'}
    )
}







exports.register_user = (req,res) => {

    const { name, email, password } = req.body

    const errors = validationResult(req) //사용자 요청에 대해 결과값을 담겠다. 패스되면 error가 없으니까. 검증이 잘되면 pass

    if(!errors.isEmpty()) { //내용이 있다면 -> 에러라면
        return res.status(422).json(errors)
    }
    // error가 안뜨면
    userModel
        .findOne({email})
        .then(user => {
            console.log(user)

            if (user) {
                return res.status(400).json({
                    errors:"email already existed"
                })
            }

            else{
                // 이메일 인증을 위한 토큰발행

                const payload = {name, email, password}
                const token = jwt.sign(
                    payload,
                    process.env.JWT_ACCOUNT_ACTIVATION,
                    {expiresIn: '10m'}
                );

                const emailData = {
                    from:process.env.EMAIL_FROM,
                    to:email,
                    subject: "blogMERN email 인증 요청 메일",
                    html:`
                    <h1>인증메일을 요청합니다.</h1>
                    <p>${process.env.CLIENT_URL}/users/activation/${token}</p>
                    <hr/>
                    <hr/>
                    <p>이 이메일은 개인정보를 포함하고 있습니다. </p>
                    `
                };

                sgMail
                    .send(emailData)
                    .then(() => {
                        return res.status(200).json({
                            message:`이메일이 ${email}로 전송되었습니다.`
                        })
                    })
                    .catch(err => {
                        res.status(400).json({
                            errors:err.message
                        })
                    })
            }
        })

        .catch(err => {
            res.json({
                errors:err.message
            })
        })
}





exports.login_user =  (req,res) => {

    const {name , email, password} = req.body

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json(errors)
    }

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



exports.current_user = (req,res) => {

    console.log(req.user)
    //payload의 형식, 발행된 jwt의 형식과 일치 but, usermodel에서 가져오는 것!
    res.json({
        id:req.user.id,
        email:req.user.email,
        name:req.user.name,
        avatar:req.user.avatar,
        // password:req.user.password
    })
}



exports.all_user =  (req,res) => {

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
}