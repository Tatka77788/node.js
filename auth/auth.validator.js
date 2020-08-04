const Joi = require("@hapi/joi");
const createUserSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "ru", "net"] },
    })
    .required(),

  password: Joi.string().min(6).max(20).required(),
  subscription: Joi.any().allow("free", "pro", "premium").only(),
  token: Joi.string().max(100).empty("").default(" "),
});

const UpdateUserSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "ru", "net"] },
  }),

  password: Joi.string().min(6).max(20),
  subscription: Joi.any().allow("free", "pro", "premium").only(),
  token: Joi.string().max(100).empty("").default(""),
});

const validate = async (schema, data) => {
  const { error } = await schema.validate(data);
  if (error) {
    const message = error.details.reduce((message, item) => {
      if (message) return `${message}, ${item.message}`;
      return `${item.message}`;
    }, "");
    throw new Error(message);
  }
};

const validateSignUpMiddleware = async (req, res, next) => {
  try {
    await validate(createUserSchema, req.body);
    next();
  } catch (e) {
    res.status(400).send({ succes: false, message: e.message });
    res.end();
    return;
  }
};

const validateLogInMiddleware = async (req, res, next) => {
  try {
    await validate(UpdateUserSchema, req.body);
    next();
  } catch (e) {
    res.status(400).send({ succes: false, message: e.message });
    res.end();
    return;
  }
};

module.exports = {
  validateSignUpMiddleware,
  validateLogInMiddleware,
};
