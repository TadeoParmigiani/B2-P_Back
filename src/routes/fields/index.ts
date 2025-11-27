import express from "express";
import fieldController from "../fields/controllers";
import validationMiddleware from '../../middleware/validator';
import { createFieldValidationSchema } from '../fields/validations';

const router = express.Router();

router.post("/", validationMiddleware(createFieldValidationSchema),fieldController.createField);           // POST /api/fields
router.get("/", fieldController.getAllFields);           
router.get("/:id", fieldController.getFieldById);        
router.patch("/:id", fieldController.updateField);        
router.delete('/hard/:id', fieldController.hardDeleteField);
router.patch('/soft/:id', fieldController.softDeleteField);


export default router;