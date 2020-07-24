const Joi = require('@hapi/joi');

const CreateContactSchema = Joi.object ({
    name: Joi
            .string()
            .min(2)
            .max(20)
            .alphanum()
            .required(),

    email: Joi
            .string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'ru', 'ua', 'net'] } })
            .required(),

    password: Joi
            .string()
            .min(6)
            .max(20)
            .pattern(new RegExp('^[a-zA-Z0-9]{8,16}$'))
            .required(),

    phone: Joi.string()
            .pattern(/^[0-9]+$/, { name: 'phone number' })
            .required(),
        
    subscription: Joi
            .string()
            .allow('free', 'pro', 'premium'),
 
    token: Joi
            .string()
            .max(100)
            .empty('')
            .default(''),                
});

const UpdateContactSchema = Joi.object({
    name: Joi.string()
           .min(2)
           .max(20)
           .alphanum(),
  
    email: Joi
           .string()
           .email({ minDomainSegments: 2, tlds: { allow: ['com', 'ru', 'ua', 'net'] }, }),

    phone: Joi
           .string()
           .pattern(/^[0-9]+$/, { name: 'phone number' }),

    subscription: Joi
           .string()
           .allow('free', 'pro', 'premium'),

    password: Joi
           .string()
           .min(6)
           .max(20),

    token: Joi
           .string()
           .max(100)
           .empty('')
           .default(''),
  });

  const validate = async (schema, data) => {
    const {error} = await schema.validate(data);
    if (error) {
        const message = error.details.reduce((message, item) => {
            if (message) return `${message}, ${item.message}`
            return `${item.message}`
        }, '')
        throw new Error(message)
    }
};

const validateCreateContactMiddleware = async (req, res, next) => {
    try {
        await validate(CreateContactSchema, req.body);
        next()
    } catch (e) {
        res.status(400).send(e.message)
        return res.end();
    }
};

const validateUpdateContactMiddleware = async (req, res, next) => {
    try {
        await validate(UpdateContactSchema, req.body);
        next()
    } catch (e) {
        res.status(400).send(e.message)
        return res.end();
    }
};

module.exports = {
    validateCreateContactMiddleware,
    validateUpdateContactMiddleware,
}