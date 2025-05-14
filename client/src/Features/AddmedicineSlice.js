import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SERVER_URL } from "../config";
import axios from "axios";

export const getMedicines = createAsyncThunk(
  "addmedicine/getMedicines",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${SERVER_URL}/getMedicines`);
      return res.data.medicines;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const addMedicine = createAsyncThunk(
  "addmedicine/addMedicine",
  async (medicine, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${SERVER_URL}/addMedicine`, medicine);
      return res.data.medicine;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const updateMedicine = createAsyncThunk(
  "addmedicine/updateMedicine",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${SERVER_URL}/updateMedicine/${id}`, data);
      return res.data.updated;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deleteMedicine = createAsyncThunk(
  "addmedicine/deleteMedicine",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${SERVER_URL}/deleteMedicine/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const AddmedicineSlice = createSlice({
  name: "addmedicine",
  initialState: {
    medicines: [],
    status: "idle",
    error: null,
  },
  reducers: {
    reset: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMedicines.fulfilled, (state, action) => {
        state.medicines = action.payload;
        state.status = "succeeded";
      })
      .addCase(addMedicine.fulfilled, (state, action) => {
        state.medicines.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(updateMedicine.fulfilled, (state, action) => {
        const index = state.medicines.findIndex(
          (m) => m._id === action.payload._id
        );
        if (index !== -1) {
          state.medicines[index] = action.payload;
        }
        state.status = "succeeded";
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.medicines = state.medicines.filter(
          (m) => m._id !== action.payload
        );
        state.status = "succeeded";
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          const errorMessage = String(action.payload);
          console.error("Request error:", errorMessage);
          // Ignore 404 errors in the UI
          if (errorMessage.includes("404")) {
            state.error = null;
          } else {
            state.error = errorMessage;
          }
        }
      );
  },
});

export const { reset } = AddmedicineSlice.actions;
export default AddmedicineSlice.reducer;
