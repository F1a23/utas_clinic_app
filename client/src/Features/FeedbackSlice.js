import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  feedbacks: [], // قائمة كل feedbacks
  status: "idle", // حالة التحميل
  error: null, // خطأ (إذا وُجد)
};

export const saveFeedback = createAsyncThunk(
  "feedbacks/saveFeedback",
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ENV.SERVER_URL}/saveFeedback`, {
        name: feedbackData.name,
        email: feedbackData.email,
        rating: feedbackData.rating,
        feedbackMsg: feedbackData.feedbackMsg,
      });
      return response.data.feedback; // ترجع feedback المحفوظ
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getFeedbacks = createAsyncThunk(
  "feedbacks/getFeedbacks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ENV.SERVER_URL}/getFeedbacks`);
      return response.data.feedbacks; // ترجع كل feedbacks
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  "feedbacks/deleteFeedback",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${ENV.SERVER_URL}/deleteFeedback/${id}`);
      return id; // نرجع الـ id فقط
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete feedback"
      );
    }
  }
);

// Slice
const FeedbackSlice = createSlice({
  name: "feedbacks",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // حفظ feedback جديد
      .addCase(saveFeedback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveFeedback.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feedbacks.unshift(action.payload); // نضيف في البداية
      })
      .addCase(saveFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // جلب كل feedbacks
      .addCase(getFeedbacks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFeedbacks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feedbacks = action.payload;
      })
      .addCase(getFeedbacks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // حذف feedback
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.filter(
          (fb) => fb._id !== action.payload
        );
      });
  },
});

export const { reset } = FeedbackSlice.actions;
export default FeedbackSlice.reducer;
