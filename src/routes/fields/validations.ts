import Joi from 'joi';

// Esquema de validación para crear un campo
export const createFieldValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required'
    }),

  type: Joi.string()
    .valid('CANCHA 5', 'CANCHA 7', 'CANCHA 11')
    .required()
    .messages({
      'string.base': 'Type must be a string',
      'any.only': 'Type must be one of: CANCHA 5, CANCHA 7, CANCHA 11',
      'any.required': 'Type is required'
    }),

  pricePerHour: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'Price per hour must be a number',
      'number.positive': 'Price per hour must be a positive number',
      'any.required': 'Price per hour is required'
    }),

  description: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(100)
    .messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 3 characters long',
      'string.max': 'Description must not exceed 100 characters',
      'any.required': 'Description is required'
    }),

  isActive: Joi.boolean().optional()
});

// Esquema de validación para actualizar un campo 
export const updateFieldValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must not exceed 100 characters'
    }),

  type: Joi.string()
    .valid('CANCHA 5', 'CANCHA 7', 'CANCHA 11')
    .messages({
      'string.base': 'Type must be a string',
      'any.only': 'Type must be one of: CANCHA 5, CANCHA 7, CANCHA 11'
    }),

  pricePerHour: Joi.number()
    .positive()
    .precision(2)
    .messages({
      'number.base': 'Price per hour must be a number',
      'number.positive': 'Price per hour must be a positive number'
    }),

  description: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .messages({
      'string.base': 'Description must be a string',
      'string.min': 'Description must be at least 3 characters long',
      'string.max': 'Description must not exceed 100 characters'
    }),

  isActive: Joi.boolean().optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});
