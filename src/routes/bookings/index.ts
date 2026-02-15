import express from "express";
import bookingController from "../bookings/controllers";
import validationMiddleware from '../../middleware/validator';
import { authenticateFirebase } from "../../middleware/authenticateFirebase";
import { createBookingValidationSchema } from '../bookings/validations';
import { authorizeAdmin } from "../../middleware/authorizeAdmin";

const router = express.Router();

router.post("/", authenticateFirebase, validationMiddleware(createBookingValidationSchema), bookingController.createBooking);           
router.get("/", bookingController.getAllBookings);           
router.get("/:id", bookingController.getBookingById);        
router.patch("/:id", authenticateFirebase, bookingController.updateBooking);        
router.delete('/hard/:id', authenticateFirebase, authorizeAdmin, bookingController.hardDeleteBooking);
router.patch('/soft/:id', authenticateFirebase, authorizeAdmin, bookingController.softDeleteBooking);

export default router;