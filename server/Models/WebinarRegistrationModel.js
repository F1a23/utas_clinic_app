import mongoose from "mongoose";

const WebinarRegistrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now },
});

const WebinarRegistrationModel = mongoose.model(
  "WebinarRegistration",
  WebinarRegistrationSchema
);
export default WebinarRegistrationModel;
