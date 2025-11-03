import { Schema, model, InferSchemaType } from "mongoose";

const scheduleSchema = new Schema({
  field: { 
    type: Schema.Types.ObjectId, 
    ref: "Field", 
    required: true 
  },
  day: { 
    type: String, 
    enum: ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"], 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  }, 
  available: { 
    type: Boolean, 
    default: true 
  }
}, 
{ 
  timestamps: true 
});

type ScheduleType = InferSchemaType<typeof scheduleSchema>;

const Schedule = model<ScheduleType>("Schedule", scheduleSchema);

export default Schedule;
