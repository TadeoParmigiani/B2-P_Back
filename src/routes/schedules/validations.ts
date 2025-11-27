import Joi from 'joi';

const VALID_TIMES = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
];

const VALID_DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const createScheduleValidationSchema = Joi.object({
  field: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.hex': 'Field must be a valid ObjectId',
      'string.length': 'Field must be a valid ObjectId',
      'any.required': 'Field is required'
    }),

  day: Joi.string()
    .valid(...VALID_DAYS)
    .required()
    .messages({
      'any.only': `Day must be one of: ${VALID_DAYS.join(", ")}`,
      'any.required': 'Day is required'
    }),

  time: Joi.string()
    .valid(...VALID_TIMES)
    .required()
    .messages({
      'any.only': `Time must be one of: ${VALID_TIMES.join(", ")}`,
      'any.required': 'Time is required'
    }),

  available: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Available must be a boolean'
    })
});

export const createBulkSchedulesValidationSchema = Joi.object({
  fieldId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.hex': 'Field ID must be a valid ObjectId',
      'any.required': 'Field ID is required'
    }),

  days: Joi.array()
    .items(Joi.string().valid(...VALID_DAYS))
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one day is required',
      'any.required': 'Days array is required'
    }),

  times: Joi.array()
    .items(Joi.string().valid(...VALID_TIMES))
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one time is required',
      'any.required': 'Times array is required'
    })
});

export const updateScheduleValidationSchema = Joi.object({
  field: Joi.string()
    .hex()
    .length(24)
    .messages({
      'string.hex': 'Field must be a valid ObjectId'
    }),

  day: Joi.string()
    .valid(...VALID_DAYS)
    .messages({
      'any.only': `Day must be one of: ${VALID_DAYS.join(", ")}`
    }),

  time: Joi.string()
    .valid(...VALID_TIMES)
    .messages({
      'any.only': `Time must be one of: ${VALID_TIMES.join(", ")}`
    }),

  available: Joi.boolean()
    .messages({
      'boolean.base': 'Available must be a boolean'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});