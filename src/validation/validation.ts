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
    phoneNumber: Joi.string().required(),
  });

  return schema.validate(obj);
};

export const validateLogin = (obj: Joi.Schema) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
  });

  return schema.validate(obj);
};

export const validateVerifyIdentityToken = (obj: Joi.Schema) => {
  const schema = Joi.object({
    learnerId: Joi.string().required(),
  });

  return schema.validate(obj);
};

export const validateInitPayment = (obj: Joi.Schema) => {
  const schema = Joi.object({
    trainingId: Joi.string().required(),
  });

  return schema.validate(obj);
};

export const validateCreateCourse = (obj: Joi.Schema) => {
  const schema = Joi.object({
    trainingId: Joi.string().required(),
    title: Joi.string().required(),
    amount: Joi.number().required(),
  });

  return schema.validate(obj);
};
