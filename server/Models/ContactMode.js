import mongoose from "mongoose";

const ContactModeSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Anonymous" },
    email: { type: String, default: "" },
    userMsg: { type: String, required: true },
    reply: { type: String },
  },
  { timestamps: true }
);

const ContactMode = mongoose.model("UserMessage", ContactModeSchema);
export default ContactMode;
