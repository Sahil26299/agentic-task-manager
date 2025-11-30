import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  countryCode: {
    type: String,
    required: [false],
  },
  phone: {
    type: String,
    required: [false],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
