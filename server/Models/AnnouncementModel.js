// models/AnnouncementModel.js
import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // رابط الصورة فقط
  },
  { timestamps: true }
);

const AnnouncementModel = mongoose.model("Announcement", AnnouncementSchema);
export default AnnouncementModel;
