import { Request, Response } from 'express';
import Schedule from '../../models/schedules';
import Field from '../../models/fields';

const VALID_TIMES = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
];


const createBulkSchedules = async (req: Request, res: Response) => {
  try {
    const { fieldId, days, times } = req.body;

    const fieldExists = await Field.findById(fieldId);
    if (!fieldExists) {
      return res.status(404).json({
        message: "Field not found",
        error: true
      });
    }

    const invalidTimes = times.filter((t: string) => !VALID_TIMES.includes(t));
    if (invalidTimes.length > 0) {
      return res.status(400).json({
        message: `Invalid times: ${invalidTimes.join(", ")}. Must be one of: ${VALID_TIMES.join(", ")}`,
        error: true
      });
    }

    const schedulesToCreate = [];
    const duplicates = [];

    for (const day of days) {
      for (const time of times) {
        const exists = await Schedule.findOne({ field: fieldId, day, time });
        if (exists) {
          duplicates.push({ day, time });
        } else {
          schedulesToCreate.push({ field: fieldId, day, time });
        }
      }
    }

    let createdSchedules = [];
    if (schedulesToCreate.length > 0) {
      createdSchedules = await Schedule.insertMany(schedulesToCreate);
    }

    res.status(201).json({
      message: "Bulk schedules created",
      data: {
        created: createdSchedules.length,
        duplicates: duplicates.length,
        duplicatesList: duplicates
      },
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating bulk schedules", error: true });
  }
};

const getAllSchedules = async (req: Request, res: Response) => {
  try {
    const { field, day, available, time } = req.query;
    let filter: any = {};
    
    if (field) filter.field = field;
    if (day) filter.day = day;
    if (time) filter.time = time;
    if (available !== undefined) filter.available = available === 'true';

    const schedules = await Schedule.find(filter)
      .populate('field', 'name type pricePerHour')
      .sort({ day: 1, time: 1 });

    res.status(200).json({
      message: "Schedules fetched successfully",
      data: schedules,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedules", error: true });
  }
};

export default {
  
  createBulkSchedules,
  getAllSchedules,
};