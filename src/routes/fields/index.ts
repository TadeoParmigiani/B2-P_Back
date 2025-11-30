import express from "express";
import fieldController from "../fields/controllers";
import validationMiddleware from '../../middleware/validator';
import { authenticateFirebase } from "../../middleware/authenticateFirebase";
import { createFieldValidationSchema } from '../fields/validations';
import { authorizeAdmin } from "../../middleware/authorizeAdmin";


const router = express.Router();

router.post("/", authenticateFirebase, authorizeAdmin, validationMiddleware(createFieldValidationSchema),fieldController.createField);           
router.get("/", fieldController.getAllFields);           
router.get("/:id", fieldController.getFieldById);        
router.patch("/:id", authenticateFirebase, authorizeAdmin, fieldController.updateField);        
router.delete('/hard/:id', authenticateFirebase, authorizeAdmin, fieldController.hardDeleteField);
router.patch('/soft/:id', authenticateFirebase, authorizeAdmin, fieldController.softDeleteField);


export default router;