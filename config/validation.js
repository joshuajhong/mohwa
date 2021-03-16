const Joi = require('joi');

const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string()
            .min(2)
            .required(),
        email: Joi.string()
            .min(3)
            .required(),
        password: Joi.string()
            .min(5)
            .required(),
        confirmPassword: Joi.string()
            .required()
            .valid(Joi.ref('password')),
        ["g-recaptcha-response"]: Joi.string().required()
    })
    return schema.validate(data)
}

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
            .min(3)
            .required(),
        password: Joi.string()
            .min(1)
            .required()
    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation