import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

// Get all messages
export const getUserMsgs = createAsyncThunk(
  "chat/getUserMsgs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${ENV.SERVER_URL}/getUserMsgs`);
      return res.data.messages;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Delete a message
export const deleteUserMsg = createAsyncThunk(
  "chat/deleteUserMsg",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${ENV.SERVER_URL}/deleteUserMsg/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Reply to a message
export const replyToMsg = createAsyncThunk(
  "chat/replyToMsg",
  async ({ id, reply }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${ENV.SERVER_URL}/replyToMsg/${id}`, {
        reply,
      });
      return res.data.updated;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const ChatSlice = createSlice({
  name: "chat",
  initialState: {
    userMessages: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserMsgs.fulfilled, (state, action) => {
        state.userMessages = action.payload;
        state.status = "succeeded";
      })
      .addCase(deleteUserMsg.fulfilled, (state, action) => {
        state.userMessages = state.userMessages.filter(
          (msg) => msg._id !== action.payload
        );
      })
      .addCase(replyToMsg.fulfilled, (state, action) => {
        const index = state.userMessages.findIndex(
          (msg) => msg._id === action.payload._id
        );
        if (index !== -1) state.userMessages[index] = action.payload;
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
      );
  },
});

export default ChatSlice.reducer;
