import express from 'express';
import controllers from './controllers';
import { authenticateFirebase } from "../../middleware/authenticateFirebase";

const router = express.Router();

router.post('/register', controllers.registerUser);
router.post('/login', controllers.loginWithEmailPassword);
router.get('/firebase/:firebaseUid', controllers.getUserByFirebaseUid);

router.get('/verify-admin', authenticateFirebase, controllers.verifyAdmin);

export default router;