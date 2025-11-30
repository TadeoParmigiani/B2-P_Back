import express from "express";
import scheduleController from "./controllers";
import validationMiddleware from '../../middleware/validator';
import { authenticateFirebase } from "../../middleware/authenticateFirebase";
import { createScheduleValidationSchema, createBulkSchedulesValidationSchema, updateScheduleValidationSchema } from './validations';
import { authorizeAdmin } from "../../middleware/authorizeAdmin";

const router = express.Router();

// ===== RUTAS PÚBLICAS =====
router.get("/", scheduleController.getAllSchedules);
router.get("/field/:fieldId", scheduleController.getSchedulesByField);


router.post("/", authenticateFirebase, authorizeAdmin , validationMiddleware(createScheduleValidationSchema), scheduleController.createSchedule);
router.post("/bulk", authenticateFirebase, authorizeAdmin, validationMiddleware(createBulkSchedulesValidationSchema), scheduleController.createBulkSchedules);
router.patch("/:id", authenticateFirebase, authorizeAdmin, validationMiddleware(updateScheduleValidationSchema),scheduleController.updateSchedule);
router.patch("/:id/toggle", authenticateFirebase, authorizeAdmin, scheduleController.toggleAvailability);

export default router;