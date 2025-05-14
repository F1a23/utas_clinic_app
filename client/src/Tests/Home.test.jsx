// استيراد مكتبة jest-dom لتوفير matchers إضافية مثل toBeInTheDocument
import "@testing-library/jest-dom";

// استيراد دوال لعرض المكون والوصول للعناصر في الشاشة أثناء الاختبار
import { render, screen } from "@testing-library/react";

// استيراد دوال كتابة الاختبارات من مكتبة vitest
import { describe, it, expect } from "vitest";

// استيراد مكون Home الذي نريد اختباره
import Home from "../component/Homecopy.jsx";

// استيراد Provider لتغليف المكون وتوفير الـ store
import { Provider } from "react-redux";

// استيراد MemoryRouter لتوفير بيئة التوجيه للمكون أثناء الاختبار
import { MemoryRouter } from "react-router-dom";

// استيراد configureStore لإنشاء store وهمي
import { configureStore } from "@reduxjs/toolkit";

// استيراد الـ reducer الخاص بالمستخدم
import userReducer from "../Features/UserSlice";

// استيراد الـ reducer الخاص بالتغذية الراجعة (Feedback)
import feedbacksReducer from "../Features/FeedbackSlice";

// ✅ إنشاء store وهمي يحتوي على user و feedbacks
const mockStore = configureStore({
  reducer: {
    users: userReducer,
    feedbacks: feedbacksReducer,
  },
  preloadedState: {
    users: {
      user: { email: "test@example.com", name: "Test User", userType: "User" },
    },
    feedbacks: {
      feedbacks: [], // قائمة تغذية راجعة فارغة للاختبار
      status: "idle", // الحالة الأولية
    },
  },
});

// ✅ دالة لتغليف المكون بمزودات Redux و Router
const renderWithProviders = (ui) =>
  render(
    <Provider store={mockStore}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );

// 🔍 مجموعة اختبارات لمكون Home
describe("Home Component", () => {
  // ✅ اختبار: عرض عنوان الهيرو الرئيسي
  it("renders the hero title", () => {
    renderWithProviders(<Home />);
    const heroTitle = screen.getByRole("heading", {
      name: /caring for students' and staffs' health/i,
    });
    expect(heroTitle).toBeInTheDocument(); // تحقق من وجود العنوان
  });

  // ✅ اختبار: عرض زر "Go to Services"
  it("renders the 'Go to Services' button", () => {
    renderWithProviders(<Home />);
    const goToServicesBtn = screen.getByRole("button", {
      name: /go to services/i,
    });
    expect(goToServicesBtn).toBeInTheDocument(); // تحقق من وجود الزر
  });

  // ✅ اختبار: عرض عنوان قسم الخدمات
  it("renders the 'Our Services' section heading", () => {
    renderWithProviders(<Home />);
    const servicesHeading = screen.getByRole("heading", {
      name: /our services/i,
    });
    expect(servicesHeading).toBeInTheDocument(); // تحقق من وجود العنوان
  });
});
