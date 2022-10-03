const Joi = require("joi");

exports.signUpUserValidation = data => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        password: Joi.string().required().min(8),
    }).options({ abortEarly: false });
    return schema.validate(data);
};

exports.loginUserValidation = data => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }).options({ abortEarly: false });
        return schema.validate(data);
};