import { Request, Response } from 'express';
import Booking from '../../models/bookings';

const createBooking = async (req: Request, res: Response) => {
  try {
    const { field, schedule, playerName, tel } = req.body;

    const booking = new Booking({ field, schedule, playerName, tel });
    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      data: booking,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: true });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { playerName, field, schedule } = req.query;
    let filter: any = {};
    
    if (playerName) {
      filter.playerName = { $regex: playerName as string, $options: 'i' };
    }
    
    if (field) {
      filter.field = field as string;
    }

    if (schedule) {
      filter.schedule = schedule as string;
    }

    const bookings = await Booking.find(filter)
      .populate('field')
      .populate('schedule');

    res.status(200).json({
      message: "Bookings fetched successfully",
      data: bookings,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: true });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('field')
      .populate('schedule');
    
    if (!booking) {
      return res.status(404).json({ 
        message: "Booking not found",
        error: true 
      });
    }
    
    res.status(200).json({
      message: "Booking fetched successfully",
      data: booking,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error: true });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { field, schedule, playerName, tel } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id, 
      { field, schedule, playerName, tel }, 
      { new: true }
    ).populate('field').populate('schedule');
    
    if (!booking) {
      return res.status(404).json({ 
        message: "Booking not found",
        error: true 
      });
    }
    
    res.status(200).json({
      message: "Booking updated successfully",
      data: booking,
      error: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error: true });
  }
};

const hardDeleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error });
  }
};

const softDeleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error soft-deleting booking", error });
  }
};

export default { 
  createBooking, 
  getAllBookings, 
  getBookingById, 
  updateBooking, 
  hardDeleteBooking, 
  softDeleteBooking 
};