import express from 'express';

import fields from './fields';
import schedules from './schedules';
import users from './user';
import bookings from './bookings';

const router = express.Router();

router.use('/users', users);
router.use('/fields', fields);
router.use('/schedules', schedules);
router.use('/bookings', bookings);

export default router;