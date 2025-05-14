import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter as Router } from "react-router-dom";
import userReducer from "../Features/UserSlice";
import Profile from "../component/Profilecopy";

// ❗️ mock for axios
import axios from "axios";
vi.mock("axios");

// ❗️ mock for SERVER_URL
vi.mock("../config", () => ({
  SERVER_URL: "http://localhost:3000",
}));

// إعداد store وهمي
const store = configureStore({
  reducer: { users: userReducer },
  preloadedState: {
    users: {
      user: {
        name: "Test User",
        email: "test@example.com",
        contactNo: "91234567",
        birthDate: "2000-01-01T00:00:00.000Z",
      },
    },
  },
});

describe("Profile Component", () => {
  beforeEach(() => {
    // إعداد ردود axios.get حسب endpoint المطلوب
    axios.get.mockImplementation((url) => {
      if (url.includes("/getAppointment")) {
        return Promise.resolve({ data: { appointments: [] } });
      }
      if (url.includes("/getUserMedications")) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes("/getPrescriptions")) {
        return Promise.resolve({
          data: { prescriptions: [] }, // ✅ مهم لتفادي الخطأ
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it("should render the heading 'Profile'", async () => {
    render(
      <Provider store={store}>
        <Router>
          <Profile />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /profile/i })
      ).toBeInTheDocument();
    });
  });

  it("should show user email", async () => {
    render(
      <Provider store={store}>
        <Router>
          <Profile />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });
  });

  it("should show contact number", async () => {
    render(
      <Provider store={store}>
        <Router>
          <Profile />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("91234567")).toBeInTheDocument();
    });
  });
});
