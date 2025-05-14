import mongoose from "mongoose";

const AddMedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0, max: 50 },
  image: { type: String, default: "" },
});

const AddMedicineModel = mongoose.model("AddMedicine", AddMedicineSchema);
export default AddMedicineModel;
