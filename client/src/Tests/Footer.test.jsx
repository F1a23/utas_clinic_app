import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Footer from "../component/Footercopy"; // ✅ تأكد أن المسار صحيح
import { describe, it, expect } from "vitest";

describe("Footer Component", () => {
  it("renders contact section", () => {
    render(<Footer />);
    expect(screen.getByText(/Contact Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Store Location/i)).toBeInTheDocument();
    expect(screen.getByText(/99292300/i)).toBeInTheDocument();
  });

  it("renders social media section", () => {
    render(<Footer />);
    expect(screen.getByText(/Social Media/i)).toBeInTheDocument();
    expect(screen.getByText(/Instagram/i)).toBeInTheDocument();
  });

  it("renders clinic description", () => {
    render(<Footer />);
    expect(
      screen.getByText(/University Clinic is a medical center/i)
    ).toBeInTheDocument();
  });

  it("renders copyright", () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2024 University Clinic. All Rights Reserved/i)
    ).toBeInTheDocument();
  });
});
