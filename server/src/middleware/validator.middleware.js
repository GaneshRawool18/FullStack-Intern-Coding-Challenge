const { body, validationResult, param } = require('express-validator');

// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Registration validation rules
exports.registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  
  body('address')
    .trim()
    .optional()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  
  exports.handleValidationErrors
];

// Login validation rules
exports.loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  exports.handleValidationErrors
];

// Store creation validation rules
exports.storeValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Store name must be between 2 and 100 characters'),
  
  body('address')
    .trim()
    .isLength({ min: 5, max: 400 })
    .withMessage('Store address must be between 5 and 400 characters'),
  
  body('description')
    .trim()
    .optional(),
  
  exports.handleValidationErrors
];

// Rating validation rules
exports.ratingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .trim()
    .optional(),
  
  param('storeId')
    .isInt()
    .withMessage('Store ID must be an integer'),
  
  exports.handleValidationErrors
]; 