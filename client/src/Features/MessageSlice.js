import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

// Initial state
const initialState = {
  userMessages: [],
  status: "idle",
  error: null,
};

// Save user message
export const saveUserMsg = createAsyncThunk(
  "userMessages/saveUserMsg",
  async (userMsgData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ENV.SERVER_URL}/saveUserMsg`, {
        name: userMsgData.name,
        email: userMsgData.email,
        userMsg: userMsgData.userMsg,
      });
      return response.data.usermessage;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get all user messages
export const getUserMsgs = createAsyncThunk(
  "userMessages/getUserMsgs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ENV.SERVER_URL}/getUserMsg`);
      return response.data.usermessages; // ← تأكد أن الاسم مطابق
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a message
export const deleteUserMsg = createAsyncThunk(
  "userMessages/deleteUserMsg",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${ENV.SERVER_URL}/deleteUserMsg/${id}`
      );
      if (response.status === 200) {
        return id;
      }
      throw new Error("Failed to delete message");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
//reply
export const replyToMsg = createAsyncThunk(
  "userMessages/replyToMsg",
  async ({ id, reply }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${ENV.SERVER_URL}/replyToMsg/${id}`, {
        reply,
      });
      return response.data.updated;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Slice
const MessageSlice = createSlice({
  name: "userMessages",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUserMsg.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveUserMsg.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userMessages.push(action.payload);
      })
      .addCase(saveUserMsg.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getUserMsgs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserMsgs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userMessages = action.payload;
      })
      .addCase(getUserMsgs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(deleteUserMsg.fulfilled, (state, action) => {
        state.userMessages = state.userMessages.filter(
          (msg) => msg._id !== action.payload
        );
        state.status = "succeeded";
      })

      //  Add reply to message
      .addCase(replyToMsg.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updated = action.payload;
        const index = state.userMessages.findIndex(
          (msg) => msg._id === updated._id
        );
        if (index !== -1) {
          state.userMessages[index] = updated;
        }
      });
  },
});

export const { reset } = MessageSlice.actions;
export default MessageSlice.reducer;
