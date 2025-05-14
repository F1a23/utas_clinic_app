// src/Tests/Prescriptions.test.jsx
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Prescriptions from "../Nurse/Prescriptionscopy"; // غيّر المسار حسب مكان الملف
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import prescriptionReducer from "../Features/PrescriptionSlice";
import { MemoryRouter } from "react-router-dom";

// إنشاء store وهمي
const store = configureStore({
  reducer: { prescriptions: prescriptionReducer },
});

describe("Prescriptions Component", () => {
  const renderWithProviders = () =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Prescriptions />
        </MemoryRouter>
      </Provider>
    );

  it("renders the form title", () => {
    renderWithProviders();
    const title = screen.getByText(/write a prescription/i);
    expect(title).toBeInTheDocument();
  });

  it("renders the patient name input", () => {
    renderWithProviders();
    const input = screen.getByPlaceholderText(/enter full name/i);
    expect(input).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderWithProviders();
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();
  });
});
