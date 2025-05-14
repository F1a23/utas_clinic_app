// src/Features/PrescriptionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../config";

// الحالة الابتدائية
const initialState = {
  prescriptions: [],
  status: "idle",
  error: null,
};

// إضافة وصفة طبية
export const addPrescription = createAsyncThunk(
  "prescriptions/addPrescription",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${SERVER_URL}/addPrescription`, formData);
      return res.data.prescription;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// جلب كل الوصفات
export const getPrescriptions = createAsyncThunk(
  "prescriptions/getPrescriptions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${SERVER_URL}/getPrescriptions`);
      return res.data.prescriptions;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Slice
const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState,
  reducers: {
    reset: (state) => {
      state.prescriptions = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPrescription.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPrescription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.prescriptions = [...(state.prescriptions || []), action.payload];
      })

      .addCase(addPrescription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getPrescriptions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPrescriptions.fulfilled, (state, action) => {
        state.prescriptions = action.payload;
        state.status = "succeeded";
      })
      .addCase(getPrescriptions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { reset } = prescriptionSlice.actions;
export default prescriptionSlice.reducer;
