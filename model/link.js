import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Link title is requried!"],
    },
    address: {
      type: String,
      required: [true, "Link address is requried!"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Link", LinkSchema);
