import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addMedicine, getMedicines } from "../Features/AddmedicineSlice";
import { Button, Input, Label, FormGroup, Container } from "reactstrap";
import {
  FaPills,
  FaTag,
  FaInfoCircle,
  FaHashtag,
  FaImage,
} from "react-icons/fa";
import "../Styles/AddMedicine.css";
import mdc from "../component/images/mdc.png";

// ✅ Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddMedicine = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    quantity: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    // التحقق من الحقول الفارغة بما فيها الصورة
    if (
      !form.name ||
      !form.type ||
      !form.description ||
      form.quantity === "" ||
      !form.image
    ) {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      toast.error("❌ Please fill all fields including image URL.");
      return;
    }

    // التحقق من الكمية
    if (form.quantity < 0 || form.quantity > 50) {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      toast.error("❌ Quantity must be between 0 and 50.");
      return;
    }

    try {
      await dispatch(addMedicine(form)).unwrap();
      await dispatch(getMedicines());

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      toast.success("✅ Medicine added successfully!");
      setForm({ name: "", type: "", description: "", quantity: "", image: "" });
    } catch (err) {
      console.warn(err);

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      toast.error("❌ Error adding medicine.");
    }
  };

  return (
    <Container fluid className="add-medicine-wrapper">
      <div className="add-medicine-box">
        <div className="add-medicine-image blue-background">
          <img src={mdc} alt="Medicine Illustration" />
        </div>

        <div className="add-medicine-form white-background">
          <h2 className="form-title">Add New Medicine</h2>
          <FormGroup className="form-fields">
            <Label>
              <FaPills className="me-2 text-primary" />
              Name
            </Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter medicine name"
            />

            <Label>
              <FaTag className="me-2 text-primary" />
              Type
            </Label>
            <Input
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="e.g., Tablet, Syrup"
            />

            <Label>
              <FaInfoCircle className="me-2 text-primary" />
              Description
            </Label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description"
            />

            <Label>
              <FaHashtag className="me-2 text-primary" />
              Quantity (0–50)
            </Label>
            <Input
              name="quantity"
              type="number"
              min="0"
              max="50"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
            />

            <Label>
              <FaImage className="me-2 text-primary" />
              Image URL
            </Label>
            <Input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Paste image link"
            />

            <Button
              color="primary"
              className="submit-btn mt-3"
              onClick={handleAdd}
            >
              Add Medicine
            </Button>
          </FormGroup>
        </div>
      </div>

      {/* ✅ Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        toastStyle={{ fontSize: "1.2rem", padding: "16px" }}
      />
    </Container>
  );
};

export default AddMedicine;
