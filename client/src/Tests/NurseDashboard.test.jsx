import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import NurseDashboard from "../Nurse/NurseDashboardcopy";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Features/UserSlice";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

// إنشاء store وهمي يحتوي على اسم الممرضة
const mockStore = configureStore({
  reducer: { users: userReducer },
  preloadedState: {
    users: {
      user: { name: "Nurse Fatima" },
    },
  },
});

describe("NurseDashboard Component", () => {
  const renderWithProviders = (ui) =>
    render(
      <Provider store={mockStore}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );

  it("should render welcome message with nurse's name", () => {
    renderWithProviders(<NurseDashboard />);
    const welcomeText = screen.getByText(/Welcome back, Nurse:/i);
    expect(welcomeText).toBeInTheDocument();
    expect(screen.getByText(/Nurse Fatima/i)).toBeInTheDocument();
  });

  it("should render 'Nurse Dashboard' title", () => {
    renderWithProviders(<NurseDashboard />);
    const title = screen.getByRole("heading", { name: /nurse dashboard/i });
    expect(title).toBeInTheDocument();
  });

  it("should display 'Today's Appointments' card", () => {
    renderWithProviders(<NurseDashboard />);
    expect(screen.getByText(/Today's Appointments/i)).toBeInTheDocument();
  });
});
