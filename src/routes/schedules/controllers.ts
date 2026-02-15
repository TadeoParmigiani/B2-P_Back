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

// const getSchedulesByField = async (req: Request, res: Response) => {
//   try {
//     const { fieldId } = req.params;
    
//     const fieldExists = await Field.findById(fieldId);
//     if (!fieldExists) {
//       return res.status(404).json({
//         message: "Field not found",
//         error: true
//       });
//     }

//     const schedules = await Schedule.find({ field: fieldId })
//       .populate('field', 'name type pricePerHour')
//       .sort({ day: 1, time: 1 });

//     res.status(200).json({
//       message: "Schedules fetched successfully",
//       data: schedules,
//       error: false
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching schedules", error: true });
//   }
// };

// const updateSchedule = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { field, day, time, available } = req.body;

//     if (time && !VALID_TIMES.includes(time)) {
//       return res.status(400).json({
//         message: `Invalid time. Must be one of: ${VALID_TIMES.join(", ")}`,
//         error: true
//       });
//     }

//     if (field) {
//       const fieldExists = await Field.findById(field);
//       if (!fieldExists) {
//         return res.status(404).json({
//           message: "Field not found",
//           error: true
//         });
//       }
//     }

//     // Verificar duplicados si se actualiza field, day o time
//     if (field || day || time) {
//       const scheduleData = await Schedule.findById(id);
//       if (!scheduleData) {
//         return res.status(404).json({
//           message: "Schedule not found",
//           error: true
//         });
//       }

//       const checkField = field || scheduleData.field;
//       const checkDay = day || scheduleData.day;
//       const checkTime = time || scheduleData.time;

//       const duplicate = await Schedule.findOne({
//         _id: { $ne: id },
//         field: checkField,
//         day: checkDay,
//         time: checkTime
//       });

//       if (duplicate) {
//         return res.status(400).json({
//           message: "Schedule already exists for this field, day and time",
//           error: true
//         });
//       }
//     }

//     const schedule = await Schedule.findByIdAndUpdate(
//       id,
//       { field, day, time, available },
//       { new: true }
//     ).populate('field', 'name type pricePerHour');

//     if (!schedule) {
//       return res.status(404).json({
//         message: "Schedule not found",
//         error: true
//       });
//     }

//     res.status(200).json({
//       message: "Schedule updated successfully",
//       data: schedule,
//       error: false
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating schedule", error: true });
//   }
// };

// const toggleAvailability = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
    
//     const schedule = await Schedule.findById(id);
//     if (!schedule) {
//       return res.status(404).json({
//         message: "Schedule not found",
//         error: true
//       });
//     }

//     schedule.available = !schedule.available;
//     await schedule.save();
//     await schedule.populate('field', 'name type pricePerHour');

//     res.status(200).json({
//       message: "Schedule availability toggled successfully",
//       data: schedule,
//       error: false
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error toggling availability", error: true });
//   }
// };

export default {
  
  createBulkSchedules,
  getAllSchedules,
};