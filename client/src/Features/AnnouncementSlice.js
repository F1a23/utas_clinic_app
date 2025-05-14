import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  announcements: [],
  status: "idle",
  error: null,
};

export const getAnnouncements = createAsyncThunk(
  "announcements/getAnnouncements",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${ENV.SERVER_URL}/getAnnouncements`);
      return res.data.announcements;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addAnnouncement = createAsyncThunk(
  "announcements/addAnnouncement",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${ENV.SERVER_URL}/addAnnouncement`,
        formData,
        {
          headers: {
            "Content-Type": "application/json", // ✅ FIXED
          },
        }
      );
      return res.data.announcement;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  "announcements/deleteAnnouncement",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${ENV.SERVER_URL}/deleteAnnouncement/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const AnnouncementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: { reset: () => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(getAnnouncements.fulfilled, (state, action) => {
        state.announcements = action.payload;
        state.status = "succeeded";
      })
      .addCase(addAnnouncement.fulfilled, (state, action) => {
        state.announcements.unshift(action.payload);
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.announcements = state.announcements.filter(
          (ann) => ann._id !== action.payload
        );
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export const { reset } = AnnouncementSlice.actions;
export default AnnouncementSlice.reducer;
