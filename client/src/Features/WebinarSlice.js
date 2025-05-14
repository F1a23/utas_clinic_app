import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config"; // ✅ استخدام متغيرات البيئة

const initialState = {
  registrations: [],
  userInfo: null,
  status: "idle",
  error: null,
};

// ✅ Get user name & email from backend
export const fetchWebinarUser = createAsyncThunk(
  "webinar/fetchWebinarUser",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${ENV.SERVER_URL}/api/healthwebinar/getUserByEmail`,
        {
          params: { email },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// ✅ Save webinar registration
export const saveWebinarRegistration = createAsyncThunk(
  "webinar/saveWebinarRegistration",
  async (registrationData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${ENV.SERVER_URL}/api/healthwebinar/register`,
        registrationData
      );
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const webinarSlice = createSlice({
  name: "webinar",
  initialState,
  reducers: {
    resetWebinar: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWebinarUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(saveWebinarRegistration.fulfilled, (state, action) => {
        state.registrations.push(action.payload); // Just storing confirmation message
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
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = "succeeded";
          state.error = null;
        }
      );
  },
});

export const { resetWebinar } = webinarSlice.actions;
export default webinarSlice.reducer;
