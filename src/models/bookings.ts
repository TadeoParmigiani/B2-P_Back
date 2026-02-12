import { Schema, model, InferSchemaType } from "mongoose";

const bookingSchema = new Schema({
  field: { 
    type: Schema.Types.ObjectId, 
    ref: "Field", 
    required: true 
    },
  schedule: { 
    type: Schema.Types.ObjectId, 
    ref: "Schedule", 
    required: true 
    },
  playerName: { 
    type: String, 
    required: true 
    },
  bookingDate: {
    type: Date,
    required: true
  },
  tel: { 
    type: String, 
    required: true 
    } 
}, 
{ 
    timestamps: true 
}
);

type BookingType = InferSchemaType<typeof bookingSchema>;

const Booking = model<BookingType>("Booking", bookingSchema);

export default Booking;
