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
    location: Joi.string().required(),
    qualification: Joi.string().required(),
    age: Joi.number().required(),
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

export const validateSingleInitPayment = (obj: Joi.Schema) => {
  const schema = Joi.object({
    trainingId: Joi.string().required(),
    frontendRedirectUrl: Joi.string().required(),
  });

  return schema.validate(obj);
};

export const validateMultipleInitPayment = (obj: Joi.Schema) => {
  const schema = Joi.object({
    moduleId: Joi.string().required(),
    frontendRedirectUrl: Joi.string().required(),
  });

  return schema.validate(obj);
};

export const validateCreateModule = (obj: Joi.Schema) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    amount: Joi.number().min(100).required(),
  });

  return schema.validate(obj);
};

export const validateCartPayment = (obj: Joi.Schema) => {
  const schema = Joi.object({
    moduleIds: Joi.array().items(Joi.string()),
    singleCourseIds: Joi.array().items(Joi.string()),
    frontendRedirectUrl: Joi.string().required(),
  });

  return schema.validate(obj);
};

export const validateCreateCourse = (obj: Joi.Schema) => {
  const schema = Joi.object({
    trainingId: Joi.string(),
    title: Joi.string().required(),
    amount: Joi.number().required(),
    moduleId: Joi.string(),
  });

  return schema.validate(obj);
};

// export const verifyTransaction = (obj: Joi.Schema) => {
//   const schema = Joi.object({
//     trainingId: Joi.string().required(),
//     title: Joi.string().required(),
//     amount: Joi.number().required(),
//   });

//   return schema.validate(obj);
// };

export const validateAddToCart = (obj: Joi.Schema) => {
  const schema = Joi.object({
    item: Joi.string().required(),
    type: Joi.string().valid("course", "module"),
  });

  return schema.validate(obj);
};
