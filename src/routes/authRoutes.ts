import { Router } from "express";
import { body, param } from 'express-validator';
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('Name cannot be empty'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('password_confirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    body('email')
        .isEmail().withMessage('Invalid Email'),
    handleInputErrors,
    AuthController.createAccount
);

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('Token cannot be empty'),
    handleInputErrors,
    AuthController.confirmAccount
);

router.post('/login',
    body('email')
        .isEmail().withMessage('Invalid Email'),
    body('password')
        .notEmpty().withMessage('Password cannot be empty'),
    handleInputErrors,
    AuthController.login
);

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Invalid Email'),
    handleInputErrors,
    AuthController.forgotPassword
);

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('Token cannot be empty'),
    handleInputErrors,
    AuthController.validateToken
);

router.post('/update-password/:token',
    param('token').notEmpty().isNumeric().withMessage('Invalid Token'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('password_confirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
);

router.get('/user',
    authenticate,
    AuthController.user
);

// Profile
router.put('/profile',
    authenticate,
    body('name')
        .notEmpty().withMessage('Name cannot be empty'),
    body('email')
        .isEmail().withMessage('Invalid Email'),
    handleInputErrors,
    AuthController.updateProfile
);

router.post('/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage('The current password cannot be empty'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('password_confirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
);

router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('Password cannot be empty'),
    handleInputErrors,
    AuthController.checkPassword
);

export default router;
