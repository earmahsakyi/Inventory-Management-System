const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const SecretKey = require('../middleware/checkSecretKey');
const {authLimiter,passwordResetLimiter} = require('../middleware/rateLimiter')
const getClientIp = require('../middleware/getClientIp')
const { check, body } = require('express-validator');


router.use(getClientIp);

// Get logged in user
router.get('/', auth, authController.getLoginUser);

// Login with rate limiting
router.post(
  '/login',
  authLimiter, // 5 attempts per hour per IP
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.AuthUserToken
);

// Register with rate limiting
router.post(
  '/register',
  authLimiter, // 5 attempts per hour per IP
  [
    check('email', 'Please enter your email').isEmail(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
  ],
  authController.registerAdmin
);

// Forgot password with stricter rate limiting
router.post(
  '/forgot-password',
  passwordResetLimiter, // 3 attempts per hour per IP
  [
    body('email').isEmail().withMessage('Invalid Email Format')
  ],
  authController.forgotPassword
);



// Reset password with rate limiting
router.post(
  '/reset-password',
  passwordResetLimiter, // 3 attempts per hour per IP
  [
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
  ],
  authController.ResetPassword
);

//request OTP
router.post('/otp',passwordResetLimiter,[
    body('email').isEmail().withMessage('Invalid Email Format')
  ], authController.RequestOTP)

//unlock route
router.post('/unlock',passwordResetLimiter,SecretKey, authController.unlockUser);


module.exports = router;