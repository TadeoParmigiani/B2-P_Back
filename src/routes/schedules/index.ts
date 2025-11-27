import express from "express";
import scheduleController from "./controllers";
import validationMiddleware from '../../middleware/validator';
import { createScheduleValidationSchema, createBulkSchedulesValidationSchema, updateScheduleValidationSchema } from './validations';

const router = express.Router();

// ===== RUTAS PÚBLICAS =====
router.get("/", scheduleController.getAllSchedules);
router.get("/field/:fieldId", scheduleController.getSchedulesByField);


router.post("/", validationMiddleware(createScheduleValidationSchema), scheduleController.createSchedule);
router.post("/bulk",validationMiddleware(createBulkSchedulesValidationSchema), scheduleController.createBulkSchedules);
router.patch("/:id", validationMiddleware(updateScheduleValidationSchema),scheduleController.updateSchedule);
router.patch("/:id/toggle", scheduleController.toggleAvailability);

export default router;