import express from 'express';


import fields from './fields';
import schedules from './schedules';
import user from './user';
import bookings from './bookings';

const router = express.Router();

router.use('/users', user);
router.use('/fields', fields);
router.use('/schedules', schedules);
router.use('/bookings', bookings);

export default router;