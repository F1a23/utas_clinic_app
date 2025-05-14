import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "../component/Logincopy.jsx";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Features/UserSlice"; // ✅ مسار مصحّح
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

const store = configureStore({
  reducer: { users: userReducer },
  preloadedState: {
    users: {
      user: { email: "test@example.com" },
      isSuccess: false,
      isError: false,
    },
  },
});

describe("Login Component", () => {
  it("should render login form elements", () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );

    // التحقق من وجود حقل البريد
    expect(
      screen.getByPlaceholderText(/enter your email/i)
    ).toBeInTheDocument();

    // التحقق من وجود حقل كلمة المرور
    expect(
      screen.getByPlaceholderText(/enter your password/i)
    ).toBeInTheDocument();

    // التحقق من وجود كل العناصر التي تحتوي على "Login"
    const loginTexts = screen.getAllByText(/login/i);
    expect(loginTexts.length).toBeGreaterThanOrEqual(1); // ✅ تفادي الخطأ
  });
});
