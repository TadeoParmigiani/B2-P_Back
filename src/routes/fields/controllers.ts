import { Request, Response } from 'express';
import Field from '../../models/fields';

const createField = async (req: Request, res: Response) => {
  try {
    const { name, type, pricePerHour, description } = req.body;

    const validTypes = ["CANCHA 5", "CANCHA 7", "CANCHA 11"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid field type. Must be one of: CANCHA 5, CANCHA 7, CANCHA 11",
        error: true
      });
    }

    const field = new Field({ name, type, pricePerHour, description });
    await field.save();

    res.status(201).json({
      message: "Field created successfully",
      data: field,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating field", error: true });
  }
};

const getAllFields = async (req: Request, res: Response) => {
  try {
    const { name, type } = req.query;
    let filter: any = {};
    
    if (name) {
      filter.name = { $regex: name as string, $options: 'i' };
    }
    
    if (type) {
      filter.type = type as string;
    }

    const fields = await Field.find(filter);
    res.status(200).json({
      message: "Fields fetched successfully",
      data: fields,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching fields", error: true });
  }
};

const getFieldById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const field = await Field.findById(id);
    
    if (!field) {
      return res.status(404).json({ 
        message: "Field not found",
        error: true 
      });
    }
    
    res.status(200).json({
      message: "Field fetched successfully",
      data: field,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching field", error: true });
  }
};

const updateField = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, pricePerHour, description } = req.body;

    
    if (type) {
      const validTypes = ["CANCHA 5", "CANCHA 7", "CANCHA 11"];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          message: "Invalid field type. Must be one of: CANCHA 5, CANCHA 7, CANCHA 11",
          error: true
        });
      }
    }

    const field = await Field.findByIdAndUpdate(
      id, 
      { name, type, pricePerHour, description }, 
      { new: true }
    );
    
    if (!field) {
      return res.status(404).json({ 
        message: "Field not found",
        error: true 
      });
    }
    
    res.status(200).json({
      message: "Field updated successfully",
      data: field,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating field", error: true });
  }
};

const hardDeleteField = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const field = await Field.findByIdAndDelete(id);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }
    res.status(200).json({ message: "Field deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting field", error });
  }
};

const softDeleteField = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const field = await Field.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }
    res.status(200).json({ message: "Field soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error soft-deleting field", error });
  }
};


export default { 
  createField, 
  getAllFields, 
  getFieldById, 
  updateField, 
  hardDeleteField, 
  softDeleteField 
};