const Joi = require('joi');

const validateUpdateUser = (req, res, next) => {
  const updareUserRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
  }).min(1);

  const validationResult = updareUserRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
};

module.exports = {
  validateUpdateUser,
};
