import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    contactNo: String,
    selectedMedications: [mongoose.Schema.Types.Mixed],
    medications: [
      {
        name: String,
        quantity: Number,
      },
    ],
    deliveryMethod: String,
    deliveryDetails: {
      buildingName: String,
      buildingNumber: String,
      roomNumber: String,
    },
  },
  { timestamps: true }
); // ✅ هذا السطر ضروري

const MedicationModel = mongoose.model("Medication", medicationSchema);
export default MedicationModel;
