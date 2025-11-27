import express from 'express';

// import user from './user';
import fields from './fields';
import schedules from './schedules';

const router = express.Router();

// router.use('/user', user);
router.use('/fields', fields);
router.use('/schedules', schedules);

export default router;