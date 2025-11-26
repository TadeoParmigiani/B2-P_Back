import express from 'express';

// import user from './user';
import fields from './fields';

const router = express.Router();

// router.use('/user', user);
router.use('/fields', fields);

export default router;