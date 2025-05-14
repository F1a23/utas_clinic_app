import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Services from "../component/Servicescopy";
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Features/UserSlice";
import { BrowserRouter as Router } from "react-router-dom";

const store = configureStore({
  reducer: { users: userReducer },
  preloadedState: {
    users: {
      user: { email: "test@example.com" }, // لتجاوز شرط تسجيل الدخول
      isSuccess: false,
      isError: false,
    },
  },
});

describe("Services", () => {
  it("should display the 'Our Services' heading", () => {
    render(
      <Provider store={store}>
        <Router>
          <Services />
        </Router>
      </Provider>
    );
    const heading = screen.getByText(/our services/i);
    expect(heading).toBeInTheDocument();
  });
});
