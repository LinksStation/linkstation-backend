import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide us your first name!"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide us your last name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email Id!"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password!"],
      minLength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
    },
    photo: {
      type: String,
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    links: [{ type: mongoose.Schema.Types.ObjectId, ref: "Link" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
