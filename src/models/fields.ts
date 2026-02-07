import { Schema, model, InferSchemaType } from "mongoose";

const fieldSchema = new Schema({
  name: { 
    type: String, 
    required: true 
    },
  type: { 
    type: String, 
    enum: ["CANCHA 5", "CANCHA 7", "CANCHA 11"], 
    required: true 
  },
  pricePerHour: { 
    type: Number, 
    required: true 
  },
  isActive: {
    type: Boolean,
    default: true
    },
  description: {
    type: String,
    required: true
    },
}, 
{ 
    timestamps: true 
}
);

type FieldType = InferSchemaType<typeof fieldSchema>;

const Field = model<FieldType>("Field", fieldSchema);

export default Field;
