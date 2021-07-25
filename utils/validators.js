const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email').isEmail().withMessage('Enter correct email')
        .custom(async (input) => {
            try {
                const candidate = await User.findOne({email: input})
                if (candidate) {
                    return Promise.resolve('User with this email already exists')
                }
            } catch (e) {
                console.log(e)
            }
        }),
    body('password', 'Password must be at least 6 characters')
        .isLength({min: 5, max: 50})
        .isAlphanumeric()
        .trim(),
    body('confirm').custom((input, {req}) => {
        if (input !== req.body.password) {
            throw  new Error('Passwords must match')
        }
        return true
    })
        .trim(),
    body('name').isLength({min: 3}).withMessage('Name must be at least 3 characters').trim()
]

exports.courseValidators = [
    body('name').isLength({min: 3}).withMessage('Minimum titles must not be 3 characters'),
    body('price').isNumeric().withMessage('Enter the correct price'),
    body('url', 'Enter the correct URL of the image').isURL()
]
