import express from "express";
import scheduleController from "./controllers";
import validationMiddleware from '../../middleware/validator';
import { authenticateFirebase } from "../../middleware/authenticateFirebase";
import {createBulkSchedulesValidationSchema } from './validations';
import { authorizeAdmin } from "../../middleware/authorizeAdmin";

const router = express.Router();

router.get("/", scheduleController.getAllSchedules);
router.post("/bulk", authenticateFirebase, authorizeAdmin, validationMiddleware(createBulkSchedulesValidationSchema), scheduleController.createBulkSchedules);

export default router;