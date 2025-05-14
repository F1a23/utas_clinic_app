import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import AddAnnouncement from "../Admin/AddAnnouncementcopy";
import { store } from "../Store/store";
import { describe, it, expect } from "vitest";

describe("AddAnnouncement Component", () => {
  it("renders the Add New Announcement title", () => {
    render(
      <Provider store={store}>
        <Router>
          <AddAnnouncement />
        </Router>
      </Provider>
    );

    const title = screen.getByText(/Add New Announcement/i);
    expect(title).toBeInTheDocument();
  });

  it("renders the title and description inputs", () => {
    render(
      <Provider store={store}>
        <Router>
          <AddAnnouncement />
        </Router>
      </Provider>
    );

    const titleInput = screen.getByPlaceholderText(/Enter title/i);
    const descInput = screen.getByPlaceholderText(/Enter description/i);
    const imageInput = screen.getByPlaceholderText(/Enter image URL/i);

    expect(titleInput).toBeInTheDocument();
    expect(descInput).toBeInTheDocument();
    expect(imageInput).toBeInTheDocument();
  });
});
