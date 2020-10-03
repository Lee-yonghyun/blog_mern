const {check} = require('express-validator')

exports.validationSignup = [

    check(`name`, `name is required`)
        .notEmpty()
        .isLength({min : 2, max : 32})
        .withMessage(`name must be between 2 and 32 characters`),
    check(`email`)
        .isEmail()
        .withMessage(`must be a valid email address`),
    check(`password`, `password is required`)
        .notEmpty()
        .isLength({min :4})
        .withMessage(`password must contain at least 4 characters`)
        .matches(/\d/)
        .withMessage(`password must contain a number`)
]

exports.validationLogin = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password', 'password is required').notEmpty(),
    check('password')
        .isLength({ min: 4 })
        .withMessage('Password must contain at least 4 characters')
        .matches(/\d/)
        .withMessage('password must contain a number')
];