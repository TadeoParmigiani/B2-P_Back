import express from 'express';
import controllers from './controllers';
// import { authenticate } from '../../middlewares/auth'; // Si tienes middleware de autenticación

const router = express.Router();

// POST /api/user/register
router.post('/register', controllers.registerUser);

// POST /api/user/login
router.post('/login', controllers.loginWithEmailPassword);

// GET /api/user/firebase/:firebaseUid
router.get('/firebase/:firebaseUid', controllers.getUserByFirebaseUid);

// GET /api/user/me
router.get('/me', controllers.getCurrentUser); 

export default router;