import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  allUsers: [],
  status: "",
  error: null,
};

export const getUsers = createAsyncThunk("manageUsers/getUsers", async () => {
  const response = await axios.get(`${ENV.SERVER_URL}/getUsers`);
  return response.data.users;
});

export const deleteUser = createAsyncThunk(
  "manageUsers/deleteUser",
  async (id) => {
    await axios.delete(`${ENV.SERVER_URL}/deleteUser/${id}`);
    return id;
  }
);

export const updateUser = createAsyncThunk(
  "manageUsers/updateUser",
  async ({ userId, userData }) => {
    const response = await axios.put(
      `${ENV.SERVER_URL}/updateUser/${userId}`,
      userData
    );
    return response.data.user;
  }
);

const manageUserSlice = createSlice({
  name: "manageUsers",
  initialState,
  reducers: { reset: () => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.allUsers = state.allUsers.filter(
          (user) => user._id !== action.payload
        );
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.allUsers.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) {
          state.allUsers[index] = action.payload;
        }
      });
  },
});

export const { reset } = manageUserSlice.actions;
export default manageUserSlice.reducer;
