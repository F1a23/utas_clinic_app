import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import UserModel from "./Models/UserModel.js";
import UserFeedbackModel from "./Models/UserFeedback.js";
import * as ENV from "./config.js";
import validator from "validator"; //تُستخدم للتحقق من صحة البيانات المدخلة
import AppointmentModel from "./Models/AppointmentModel.js";
import MedicationModel from "./Models/MedicationModel.js";
import AddMedicineModel from "./Models/AddMedicineModel.js";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import AnnouncementModel from "./Models/AnnouncementModel.js";
import PrescriptionModel from "./Models/PrescriptionModel.js";
import ContactMode from "./Models/ContactMode.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ تحديث إعدادات CORS لدعم أكثر من origin
const allowedOrigins = process.env.CLIENT_URL?.split(",") || [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ تعديل الاتصال بقاعدة البيانات (حذف الإعدادات القديمة)
const connectString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_CLUSTER}/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(connectString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ إضافة اختبار بسيط لتأكيد أن السيرفر شغال
app.get("/", (req, res) => {
  res.send("Server is running...");
});

//------USERS-------

// POST API - Register User
app.post("/registerUser", async (req, res) => {
  try {
    const {
      email,
      id,
      name,
      gender,
      civilNumber,
      birthDate,
      contactNo,
      department,
      specialization,
      userType,
      password,
    } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingId = await UserModel.findOne({ id });
    if (existingId) {
      return res.status(400).json({ error: "ID already exists" });
    }

    const requiredFields = {
      id,
      name,
      gender,
      civilNumber,
      birthDate,
      contactNo,
      email,
      department,
      specialization,
      userType,
      password,
    };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || value === "") {
        return res.status(400).json({ error: `Missing field: ${key}` });
      }
    }

    const parsedBirthDate = new Date(birthDate);
    if (isNaN(parsedBirthDate.getTime())) {
      return res.status(400).json({ error: "Invalid birth date format" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      id,
      name,
      gender,
      civilNumber,
      birthDate: parsedBirthDate,
      contactNo,
      email,
      department,
      specialization,
      userType,
      password: hashedPassword,
    });

    await user.save();
    res.status(200).json({ user, msg: "User added successfully." });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "An unexpected error occurred", details: error.message });
  }
});

// POST API - Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ تحقق من كلمة السر المدخلة مقابل المشفرة في قاعدة البيانات
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // ✅ إذا كانت صحيحة، أرجع بيانات المستخدم
    res.json({
      name: user.name,
      email: user.email,
      contactNo: user.contactNo,
      userType: user.userType,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST API - Logout
app.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// Get all users
app.get("/getUsers", async (req, res) => {
  try {
    const users = await UserModel.find({}).sort({ name: 1 });
    const usersCount = await UserModel.countDocuments({});
    res.send({ users, count: usersCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Get single user by ID
app.get("/getUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.send({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Delete user by ID
app.delete("/deleteUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
});

//update user
app.put("/updateUser/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    gender,
    civilNumber,
    birthDate,
    contactNo,
    email,
    department,
    specialization,
    userType,
    password,
  } = req.body;

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name || user.name;
    user.gender = gender || user.gender;
    user.civilNumber = civilNumber || user.civilNumber;
    user.birthDate = birthDate || user.birthDate;
    user.contactNo = contactNo || user.contactNo;
    user.email = email || user.email;
    user.department = department || user.department;
    user.specialization = specialization || user.specialization;
    user.userType = userType || user.userType;

    if (password && password !== user.password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "An error occurred while updating user" });
  }
});

//-----END CODE FOR USERS-----

//---------FEEDBACK---------
// Save Feedback API

app.post("/saveFeedback", async (req, res) => {
  try {
    const { name, email, rating, feedbackMsg } = req.body;

    const feedback = new UserFeedbackModel({
      name,
      email,
      rating,
      feedbackMsg,
    });

    await feedback.save(); // حفظ الملاحظات في قاعدة البيانات

    res.send({ feedback, msg: "Added successfully!" });
  } catch (error) {
    console.error("Error in /saveFeedback:", error);
    res.status(500).json({ error: "An error occurred while saving feedback." });
  }
});

//get all feedbacks
app.get("/getFeedbacks", async (req, res) => {
  try {
    const feedbacks = await UserFeedbackModel.find();
    res.send({ feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching feedbacks." });
  }
});
app.delete("/deleteFeedback/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const feedback = await UserFeedbackModel.findByIdAndDelete(id);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting feedback" });
  }
});
//---------END COFR FEEDBACK---------

//---------   announcement API (image only)   ----------

// ADD Announcement
app.post("/addAnnouncement", async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (!title || !description || !image) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newAnnouncement = new AnnouncementModel({
      title,
      description,
      image,
    });

    await newAnnouncement.save();

    res.status(201).json({
      message: "Announcement added successfully",
      announcement: newAnnouncement,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add announcement." });
  }
});

// GET All Announcements
app.get("/getAnnouncements", async (req, res) => {
  try {
    const announcements = await AnnouncementModel.find().sort({
      createdAt: -1,
    });
    res.status(200).json({ announcements });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcements." });
  }
});

// UPDATE Announcement
app.put("/updateAnnouncement/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    if (!title || !description || !image) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const updated = await AnnouncementModel.findByIdAndUpdate(
      id,
      { title, description, image },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Announcement not found." });
    }

    res.status(200).json({
      message: "Announcement updated successfully",
      announcement: updated,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update announcement." });
  }
});

// DELETE Announcement
app.delete("/deleteAnnouncement/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await AnnouncementModel.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ error: "Announcement not found." });
  }
  res.status(200).json({ message: "Announcement deleted successfully" });
});

//--------- end of announcement API ----------

//-----------user contact--------------// ✅ POST: حفظ رسالة المستخدم

app.post("/saveUserMsg", async (req, res) => {
  try {
    const { name, email, userMsg, reply } = req.body;

    if (!userMsg || !name) {
      return res
        .status(400)
        .json({ message: "Name and message are required." });
    }

    const usermessage = new ContactMode({ name, email, userMsg, reply });

    await usermessage.save();

    res
      .status(201)
      .json({ usermessage, msg: "Message submitted successfully!" });
  } catch (error) {
    console.error("❌ Error saving message:", error);
    res.status(500).json({ error: "An error occurred while saving message." });
  }
});

// ✅ GET: جلب جميع الرسائل
app.get("/getUserMsg", async (req, res) => {
  try {
    const usermessages = await ContactMode.find().sort({ createdAt: -1 });
    res.status(200).json({ usermessages });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages." });
  }
});

// ✅ DELETE: حذف رسالة حسب ID
app.delete("/deleteUserMsg/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await ContactMode.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json({ msg: "Message deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting message:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting message." });
  }
});
//reply mess
// لحفظ الرد على الرسالة
app.put("/replyToMsg/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply || reply.trim() === "") {
      return res.status(400).json({ error: "Reply is required." });
    }

    const updated = await ContactMode.findByIdAndUpdate(
      id,
      { reply },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Message not found." });
    }

    res.status(200).json({ message: "Reply saved successfully.", updated });
  } catch (error) {
    console.error("❌ Error updating reply:", error);
    res.status(500).json({ error: "Failed to update reply." });
  }
});

//-----------end of user contact code--------------
// CHECK if time is available
app.get("/checkAppointment", async (req, res) => {
  const { date, time } = req.query;

  if (!date || !time) {
    return res.status(400).send({ error: "Date and time are required" });
  }

  const appointmentDate = new Date(date);
  const dayOfWeek = appointmentDate.getDay(); // 5 = Friday, 6 = Saturday
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    return res.status(400).send({
      error: "Appointments cannot be scheduled on Friday or Saturday.",
    });
  }

  // ✅ 24-hour format check (08:00 to 14:00)
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);
  if (
    isNaN(hour) ||
    isNaN(minutes) ||
    hour < 8 ||
    hour > 14 ||
    (hour === 14 && minutes > 0)
  ) {
    return res.status(400).send({
      error:
        "Appointment time must be between 08:00 and 14:00 (24-hour format).",
    });
  }

  try {
    const appointment = await AppointmentModel.findOne({
      appointmentDate: date,
      appointmentTime: time,
    });

    if (appointment) {
      return res.json({
        isTimeTaken: true,
        error:
          "The selected time is already taken. Please choose a different time.",
      });
    }

    return res.json({ isTimeTaken: false });
  } catch (error) {
    console.error("Error checking appointment:", error);
    return res.status(500).send({ error: "Error checking appointment." });
  }
});

// SAVE new appointment
app.post("/saveAppointment", async (req, res) => {
  const {
    name,
    email,
    contactNo,
    appointmentDate,
    appointmentTime,
    serviceType,
  } = req.body;

  if (
    !name ||
    !email ||
    !contactNo ||
    !appointmentDate ||
    !appointmentTime ||
    !serviceType
  ) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const appointmentDateObj = new Date(appointmentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (appointmentDateObj <= today) {
    return res.status(400).send({
      error: "Appointment date must be after today.",
    });
  }

  const dayOfWeek = appointmentDateObj.getDay();
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    return res.status(400).send({
      error: "Appointments cannot be scheduled on Friday or Saturday.",
    });
  }

  const hour = parseInt(appointmentTime.split(":")[0], 10);
  const minutes = parseInt(appointmentTime.split(":")[1], 10);
  if (
    isNaN(hour) ||
    isNaN(minutes) ||
    hour < 8 ||
    hour > 14 ||
    (hour === 14 && minutes > 0)
  ) {
    return res.status(400).send({
      error:
        "Appointment time must be between 8:00 AM and 2:00 PM (24-hour format).",
    });
  }

  try {
    const existingAppointment = await AppointmentModel.findOne({
      appointmentDate,
      appointmentTime,
    });

    if (existingAppointment) {
      return res.status(400).send({
        error:
          "The selected time slot is already taken. Please choose a different time.",
      });
    }

    const newAppointment = new AppointmentModel({
      name,
      email,
      contactNo,
      appointmentDate,
      appointmentTime,
      serviceType,
    });

    await newAppointment.save();
    res.status(200).send({ msg: "Appointment successfully scheduled" });
  } catch (error) {
    console.error("Error saving appointment:", error);
    res.status(500).send({ error: "Failed to schedule appointment" });
  }
});

// ✅ Get appointments for a user (returning as array)
app.get("/getAppointment", async (req, res) => {
  try {
    const { email } = req.query;
    const appointments = await AppointmentModel.find({ email }).sort({
      appointmentDate: -1, // الأحدث أولاً
    });

    if (!appointments.length) {
      return res.status(404).json({ error: "No appointments found" });
    }

    res.status(200).json({ appointments }); // <-- مهم جداً أن ترجع مصفوفة
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// GET ALL appointments
app.get("/getAllAppointments", async (req, res) => {
  try {
    const appointments = await AppointmentModel.find().sort({
      appointmentDate: -1,
    });
    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error getting appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

//  UPDATE appointment
app.put("/updateAppointment/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    contactNo,
    appointmentDate,
    appointmentTime,
    serviceType,
  } = req.body;

  try {
    const updated = await AppointmentModel.findByIdAndUpdate(
      id,
      { name, email, contactNo, appointmentDate, appointmentTime, serviceType },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json({ updated });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

// DELETE appointment
app.delete("/deleteAppointment/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await AppointmentModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});
//---------------------------

// ------User Profile----------
app.get("/getUserProfile", async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from authentication middleware
    console.log(`Fetching profile for user ID: ${userId}`);

    const user = await UserModel.findOne({ id: userId });
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const userData = {
      name: user.name,
      email: user.email,
      contactNo: user.contactNo,
      birthDate: user.birthDate,
      civilNumber: user.civilNumber,
      department: user.department,
      specialization: user.specialization,
      userType: user.userType,
      clinicBooking: user.clinicBooking,
      medicineBooking: user.medicineBooking,
    };

    return res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Failed to retrieve user profile" });
  }
});

// ------ End of User Profile----------

// POST: Save medication summary
app.post("/saveUserMedication", async (req, res) => {
  const {
    name,
    email,
    contactNo,
    selectedMedications,
    medications,
    deliveryMethod,
    deliveryDetails,
  } = req.body;

  // تحقق من وجود كافة البيانات المطلوبة
  if (!name || !email || !contactNo || !medications) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // ✅ 1. تحديث المخزون (stock) في AddMedicineModel
    for (const med of medications) {
      const existingMed = await AddMedicineModel.findById(med.id);
      if (!existingMed) {
        return res
          .status(404)
          .json({ error: `Medication with ID ${med.id} not found.` });
      }

      // تحقق أن الكمية كافية
      if (existingMed.quantity < med.quantity) {
        return res.status(400).json({
          error: `Not enough stock for ${existingMed.name}. Only ${existingMed.quantity} left.`,
        });
      }

      // إنقاص الكمية
      existingMed.quantity -= med.quantity;
      await existingMed.save();
    }

    // ✅ 2. حفظ الطلب في MedicationModel
    const newMedication = new MedicationModel({
      name,
      email,
      contactNo,
      selectedMedications,
      medications,
      deliveryMethod,
      deliveryDetails,
    });

    await newMedication.save();

    // ✅ 3. الرد بعد نجاح الحفظ
    return res.status(200).json({
      msg: "Medication data saved successfully!",
      userMedication: newMedication,
    });
  } catch (error) {
    console.error("Save error:", error);
    return res.status(500).json({ error: "Failed to save medication" });
  }
});
// get medication summary of the user
app.get("/getUserMedications", async (req, res) => {
  try {
    const { email } = req.query;
    const medications = await MedicationModel.find({ email });
    res.json(medications);
  } catch (err) {
    console.error("Error fetching medications:", err);
    res.status(500).json({ message: "Error fetching medications" });
  }
});

app.get("/getMedicines", async (req, res) => {
  try {
    const medicines = await AddMedicineModel.find().sort({ name: 1 });
    res.status(200).send({ medicines });
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch medicines" });
  }
});
//get select item for user
app.post("/getSelectedMedicines", async (req, res) => {
  const { ids } = req.body;

  try {
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: "Invalid IDs array" });
    }

    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id)); // ✅ استخدام new

    const medicines = await MedicationModel.find({
      _id: { $in: objectIds },
    });

    res.status(200).json({ medicines });
  } catch (error) {
    console.error("Error fetching selected medications:", error);
    res.status(500).json({ error: "Failed to fetch selected medications" });
  }
});
app.use(bodyParser.json());

// إعداد البريد الإلكتروني باستخدام nodemailer و Outlook
const transporter = nodemailer.createTransport({
  service: "hotmail", // أو 'outlook' إذا كنت تستخدم Outlook
  auth: {
    user: process.env.EMAIL, // اكتب هنا الإيميل الذي سترسل منه الرسائل (مثل outlook.com أو hotmail.com)
    pass: process.env.EMAIL_PASSWORD, // كلمة مرور هذا الإيميل أو كلمة مرور خاصة إذا كان الحساب يستخدم المصادقة الثنائية
  },
});

// مسار استعادة كلمة السر
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // تحقق من وجود المستخدم في قاعدة البيانات
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }

    // توليد رابط إعادة تعيين كلمة السر (يجب عليك استخدام رابط حقيقي مع رمز تحقق)
    const resetLink = `http://localhost:3000/reset-password?email=${email}`;

    // إرسال البريد الإلكتروني للمستخدم عبر Outlook
    const mailOptions = {
      from: process.env.EMAIL, // الإيميل الذي سترسل منه
      to: email,
      subject: "Reset Your Password",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    // إرسال البريد الإلكتروني
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res
          .status(500)
          .json({ success: false, message: "Error sending email" });
      }
      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
      });
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during password reset",
    });
  }
});
//--- Add  medicine from Nurse----------
// Get all medicines

// Add medicine
app.post("/addMedicine", async (req, res) => {
  const { name, type, description, quantity, image } = req.body;
  if (quantity < 0 || quantity > 50) {
    return res
      .status(400)
      .json({ error: "Quantity must be between 0 and 50." });
  }

  try {
    const newMed = new AddMedicineModel({
      name,
      type,
      description,
      quantity,
      image,
    });
    await newMed.save();
    res.status(200).send({ medicine: newMed });
  } catch (error) {
    res.status(500).send({ error: "Failed to add medicine" });
  }
});

// Update medicine
app.put("/updateMedicine/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, description, quantity, image } = req.body;
  if (quantity < 0 || quantity > 50) {
    return res
      .status(400)
      .json({ error: "Quantity must be between 0 and 50." });
  }

  try {
    const updated = await AddMedicineModel.findByIdAndUpdate(
      id,
      { name, type, description, quantity, image },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.status(200).send({ updated });
  } catch (error) {
    res.status(500).send({ error: "Failed to update medicine" });
  }
});

// Delete medicine
app.delete("/deleteMedicine/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await AddMedicineModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.status(200).send({ msg: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to delete medicine" });
  }
});
app.post("/saveUserMedication", async (req, res) => {
  const {
    name,
    email,
    contactNo,
    selectedMedications,
    medications,
    deliveryMethod,
    deliveryDetails,
  } = req.body;

  if (!name || !email || !contactNo || !medications || !medications.length) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    // 🔎 1. تحقق كم مرة طلب المستخدم اليوم
    const userOrdersToday = await MedicationModel.find({
      email,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (userOrdersToday.length >= 2) {
      return res.status(400).json({
        error:
          "⛔ You have reached the daily medication order limit (2 per day).",
      });
    }

    // 🔎 2. تحقق إن كان طلب نفس الدواء اليوم
    const orderedMedNamesToday = userOrdersToday.flatMap((order) =>
      order.medications.map((m) => m.name)
    );

    const duplicateMed = medications.find((m) =>
      orderedMedNamesToday.includes(m.name)
    );

    if (duplicateMed) {
      return res.status(400).json({
        error: `⛔ You already ordered "${duplicateMed.name}" today.`,
      });
    }

    // ✅ إنشاء الطلب الجديد
    const newMedication = new MedicationModel({
      name,
      email,
      contactNo,
      selectedMedications,
      medications,
      deliveryMethod,
      deliveryDetails,
      createdAt: new Date(), // تأكد أن لديك هذا في الـ schema
    });

    await newMedication.save();

    // ✅ أنقِص الكمية من كل دواء
    for (const med of medications) {
      await AddMedicineModel.updateOne(
        { name: med.name },
        { $inc: { quantity: -med.quantity } }
      );
    }

    return res.status(200).json({
      msg: "✅ Medication data saved successfully!",
      userMedication: newMedication,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "❌ Failed to save medication" });
  }
});

//check order of the user
app.post("/checkUserMedicationLimit", async (req, res) => {
  const { email, selectedMedications } = req.body;

  if (!email || !Array.isArray(selectedMedications)) {
    return res.status(400).json({ allowed: false, message: "Invalid input." });
  }

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayOrders = await MedicationModel.find({
      email,
      createdAt: { $gte: startOfDay },
    });

    // 1. تحقق من عدد الطلبات اليوم
    if (todayOrders.length >= 2) {
      return res.status(200).json({
        allowed: false,
        message: "You can only request medications twice per day.",
      });
    }

    // 2. تحقق من تكرار نفس الدواء
    const allRequestedIds = todayOrders.flatMap((order) =>
      order.selectedMedications.map((id) => String(id))
    );

    const repeated = selectedMedications.some((id) =>
      allRequestedIds.includes(String(id))
    );

    if (repeated) {
      return res.status(200).json({
        allowed: false,
        message: "You have already requested one of these medications today.",
      });
    }

    res.json({ allowed: true });
  } catch (err) {
    res.status(500).json({ allowed: false, message: "Server error." });
  }
});

// POST: Add a prescription with validation and duplication check
app.post("/addPrescription", async (req, res) => {
  const {
    patientName,
    gender,
    birthDate,
    age,
    visitDate,
    visitTime,
    prescription,
    recommendations,
  } = req.body;

  if (
    !patientName ||
    !gender ||
    !birthDate ||
    !age ||
    !visitDate ||
    !visitTime ||
    !prescription
  ) {
    return res
      .status(400)
      .json({ error: "All required fields must be filled" });
  }

  try {
    // منع التكرار: لا يُسمح بوصفة لنفس الموعد (نفس الاسم + التاريخ + الوقت)
    const startOfDay = new Date(visitDate);
    const endOfDay = new Date(visitDate);
    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await PrescriptionModel.findOne({
      patientName,
      visitDate: { $gte: startOfDay, $lte: endOfDay },
      visitTime,
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "A prescription already exists for this appointment." });
    }

    const newPrescription = new PrescriptionModel({
      patientName,
      gender,
      birthDate,
      age,
      visitDate,
      visitTime,
      prescription,
      recommendations,
    });

    const savedPrescription = await newPrescription.save();

    res.status(201).json({
      message: "Prescription added",
      prescription: savedPrescription,
    });
  } catch (err) {
    console.error("Error saving prescription:", err);
    res.status(500).json({ error: "Server error while saving prescription" });
  }
});
app.get("/getPrescriptions", async (req, res) => {
  try {
    const prescriptions = await PrescriptionModel.find().sort({
      createdAt: -1,
    });
    res.status(200).json({ prescriptions });
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
});
app.get("/checkPrescription", async (req, res) => {
  const { name, date, time } = req.query;

  if (!name || !date || !time) {
    return res
      .status(400)
      .json({ error: "Missing required query parameters." });
  }

  try {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const exists = await PrescriptionModel.findOne({
      patientName: name,
      visitDate: { $gte: startOfDay, $lte: endOfDay },
      visitTime: time,
    });

    res.json({ exists: !!exists });
  } catch (err) {
    console.error("Error checking prescription:", err);
    res
      .status(500)
      .json({ error: "Server error while checking prescription." });
  }
});
//  Check if a prescription already exists for the same appointment
app.get("/checkPrescriptionAppointment", async (req, res) => {
  const { name, date, time } = req.query;

  if (!name || !date || !time) {
    return res.status(400).json({ error: "Missing name, date, or time." });
  }

  try {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const exists = await PrescriptionModel.findOne({
      patientName: name,
      visitDate: { $gte: startOfDay, $lte: endOfDay },
      visitTime: time,
    });

    res.json({ exists: !!exists });
  } catch (err) {
    console.error("❌ Error checking prescription:", err);
    res
      .status(500)
      .json({ error: "Server error while checking prescription." });
  }
});

//get user
app.get("/getUserByEmail", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      birthDate: user.birthDate,
      gender: user.gender,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});
//user mess and nurse:
app.get("/getUserMsgs", async (req, res) => {
  try {
    const messages = await ContactMode.find().sort({ createdAt: -1 });
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to load user messages" });
  }
});

app.post("/addUserMsg", async (req, res) => {
  const { name, email, userMsg } = req.body;
  try {
    const newMsg = new ContactMode({ name, email, userMsg });
    const saved = await newMsg.save();
    res.status(201).json({ message: "Message added", data: saved });
  } catch (err) {
    res.status(500).json({ error: "Failed to add message" });
  }
});

app.put("/replyToMsg/:id", async (req, res) => {
  const { reply } = req.body;
  try {
    const updated = await ContactMode.findByIdAndUpdate(
      req.params.id,
      { reply },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Message not found" });
    res.json({ message: "Reply sent", updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to send reply" });
  }
});

app.delete("/deleteUserMsg/:id", async (req, res) => {
  try {
    const deleted = await ContactMode.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Message not found" });
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// ✅ Delete medication request by ID
app.delete("/deleteMedicationOrder/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MedicationModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Medication request not found." });
    }

    res.json({ message: "Request deleted successfully." });
  } catch (err) {
    console.error("Error deleting medication request:", err);
    res.status(500).json({ error: "Server error while deleting request." });
  }
});

// GET all medications
app.get("/medications", async (req, res) => {
  try {
    const meds = await MedicationModel.find();
    res.status(200).json({ medications: meds });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch medications." });
  }
});

// POST to update stock
app.post("/medications/order", async (req, res) => {
  const { order } = req.body; // { id: quantity }
  try {
    const updates = await Promise.all(
      Object.entries(order).map(async ([id, qty]) => {
        const med = await MedicationModel.findById(id);
        if (!med || med.quantity < qty) {
          throw new Error(
            `Not enough stock for ${med?.name || "Unknown Item"}`
          );
        }
        med.quantity -= qty;
        await med.save();
        return med;
      })
    );
    res.status(200).json({ message: "Order placed", updated: updates });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/saveUserMedication", async (req, res) => {
  const data = req.body;
  console.log("📦 Incoming data:", data);

  try {
    // تحقق من توفر الكمية
    for (let item of data.medications) {
      const med = await AddMedicineModel.findById(item.id);
      if (!med || med.quantity < item.quantity) {
        console.log(`❌ Not enough stock for: ${item.name}`);
        return res
          .status(400)
          .json({ error: `Not enough stock for ${item.name}` });
      }
    }

    // حفظ الطلب
    const request = new MedicationModel(data);
    await request.save();

    // خصم الكمية من المخزون
    for (let item of data.medications) {
      await AddMedicineModel.updateOne(
        { _id: item.id },
        { $inc: { quantity: -item.quantity } }
      );
    }

    res.status(200).json({
      msg: "Medication request saved successfully",
      userMedication: request,
    });
  } catch (err) {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ error: "Failed to save medication request" });
  }
});

app.get("/checkMedicationOrder", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const existingOrder = await MedicationModel.findOne({ email });

    if (existingOrder) {
      return res.status(200).json({ exists: true });
    }

    return res.status(200).json({ exists: false });
  } catch (err) {
    console.error("Error checking medication order:", err);
    return res.status(500).json({ error: "Server error checking order." });
  }
});

// ✅ Register user to a webinar topic
app.post("/registerwebinartopic", async (req, res) => {
  const { email, topic } = req.body;

  if (!email || !topic) {
    return res.status(400).json({ error: "Email and topic are required." });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const alreadyRegistered = await WebinarRegistrationModel.findOne({
      userId: user._id,
      topic,
    });

    if (alreadyRegistered) {
      return res
        .status(409)
        .json({ error: "Already registered for this topic." });
    }

    const registration = new WebinarRegistrationModel({
      userId: user._id,
      topic,
    });

    await registration.save();

    res.status(201).json({ message: "✅ Registered successfully." });
  } catch (err) {
    console.error("Error registering:", err);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// API: جلب جميع طلبات الأدوية للمستخدمين
app.get("/getAllMedicationRequests", async (req, res) => {
  try {
    const all = await MedicationModel.find().sort({ createdAt: -1 });
    res.status(200).json(all);
  } catch (err) {
    console.error("Error fetching all medication requests:", err);
    res.status(500).json({ error: "Failed to fetch medication requests" });
  }
});

//---------------------------------------------------------------

// Start server
const port = ENV.PORT || 3001;
app.listen(port, () => {
  console.log(`You are connected at port: ${port}`);
});
