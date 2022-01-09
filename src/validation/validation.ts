import Joi from "joi";

/**
 * 
 * @param joi 
 * login
firstName
lastName
email
password
learnerId
 */

export const validateSignup = (obj: Joi.Schema) => {
  const schema = Joi.object({
    firstname: Joi.string().min(1).max(30).required(),
    lastname: Joi.string().min(1).max(30).required(),
    login: Joi.string().min(1).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
  });

  return schema.validate(obj);
};
