import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    gender: { type: String, required: true },
    birthDate: { type: Date, required: true },
    age: { type: Number, required: true },
    visitDate: { type: Date, required: true },
    visitTime: { type: String, required: true },
    prescription: { type: String, required: true },
    recommendations: { type: String },
  },
  { timestamps: true }
);

const PrescriptionModel = mongoose.model("Prescription", PrescriptionSchema);
export default PrescriptionModel;
