import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  role: { 
    type: String, 
    enum: ["admin", "jugador"],
    default: "jugador" 
  }
}, 
{ 
    timestamps: true 
}
);


type UserType = InferSchemaType<typeof userSchema>;

const User = model<UserType>("User", userSchema);

export default User;