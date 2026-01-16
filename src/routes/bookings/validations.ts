import Joi from 'joi';

export const createBookingValidationSchema = Joi.object({
  field: Joi.string()
    .trim()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.base': 'Field must be a string',
      'string.empty': 'Field is required',
      'string.pattern.base': 'Field must be a valid MongoDB ObjectId',
      'any.required': 'Field is required'
    }),

  schedule: Joi.string()
    .trim()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.base': 'Schedule must be a string',
      'string.empty': 'Schedule is required',
      'string.pattern.base': 'Schedule must be a valid MongoDB ObjectId',
      'any.required': 'Schedule is required'
    }),

  playerName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'Player name must be a string',
      'string.empty': 'Player name is required',
      'string.min': 'Player name must be at least 2 characters long',
      'string.max': 'Player name must not exceed 100 characters',
      'any.required': 'Player name is required'
    }),

  tel: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]+$/)
    .min(7)
    .max(20)
    .required()
    .messages({
      'string.base': 'Phone number must be a string',
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number format is invalid',
      'string.min': 'Phone number must be at least 7 characters long',
      'string.max': 'Phone number must not exceed 20 characters',
      'any.required': 'Phone number is required'
    })
});

export const updateBookingValidationSchema = Joi.object({
  field: Joi.string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.base': 'Field must be a string',
      'string.pattern.base': 'Field must be a valid MongoDB ObjectId'
    }),

  schedule: Joi.string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.base': 'Schedule must be a string',
      'string.pattern.base': 'Schedule must be a valid MongoDB ObjectId'
    }),

  playerName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .messages({
      'string.base': 'Player name must be a string',
      'string.min': 'Player name must be at least 2 characters long',
      'string.max': 'Player name must not exceed 100 characters'
    }),

  tel: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]+$/)
    .min(7)
    .max(20)
    .messages({
      'string.base': 'Phone number must be a string',
      'string.pattern.base': 'Phone number format is invalid',
      'string.min': 'Phone number must be at least 7 characters long',
      'string.max': 'Phone number must not exceed 20 characters'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const bookingQueryValidationSchema = Joi.object({
  playerName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional(),

  field: Joi.string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),

  schedule: Joi.string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
});