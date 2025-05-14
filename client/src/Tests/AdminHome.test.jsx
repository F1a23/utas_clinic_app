import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminHome from "../Admin/AdminHomecopy";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

describe("AdminHome Component", () => {
  it("renders the Admin Home title", () => {
    render(
      <Router>
        <AdminHome />
      </Router>
    );

    const title = screen.getByText(/Admin Home/i);
    expect(title).toBeInTheDocument();
  });

  it("renders all admin cards", () => {
    render(
      <Router>
        <AdminHome />
      </Router>
    );

    // ✅ استخدم getAllByText بدلاً من getByText
    const addAnnouncementCards = screen.getAllByText(/Add Announcement/i);
    expect(addAnnouncementCards.length).toBeGreaterThan(0);

    const viewFeedbackCards = screen.getAllByText(/View Feedback/i);
    expect(viewFeedbackCards.length).toBeGreaterThan(0);

    const reportsCards = screen.getAllByText(/Reports & Analytics/i);
    expect(reportsCards.length).toBeGreaterThan(0);
  });
});
