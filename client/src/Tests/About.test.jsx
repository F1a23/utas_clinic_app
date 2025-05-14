// استيراد مكتبة jest-dom لتوفير matchers إضافية مثل toBeInTheDocument
import "@testing-library/jest-dom";

// استيراد دوال لعرض المكون والوصول للعناصر في الشاشة أثناء الاختبار
import { render, screen } from "@testing-library/react";

// استيراد دوال كتابة الاختبارات من مكتبة vitest
import { describe, it, expect } from "vitest";

// استيراد المكون الذي نريد اختباره
import AboutUs from "../component/AboutUscopy.jsx";

// استيراد Provider من react-redux لتوفير Store داخل الاختبار
import { Provider } from "react-redux";

// استيراد دالة configureStore لإنشاء Store وهمي
import { configureStore } from "@reduxjs/toolkit";

// استيراد الـ reducer الخاص بالمستخدم (لربط الـ store مع المكون)
import userReducer from "../Features/UserSlice";

// استيراد MemoryRouter لتوفير دعم التوجيه (Router) داخل بيئة الاختبار
import { MemoryRouter } from "react-router-dom";

// إنشاء Store وهمي لاختبار المكون
const mockStore = configureStore({
  reducer: {
    users: userReducer, // تعريف الـ reducer الخاص بالمستخدم
  },
  preloadedState: {
    users: {
      // حالة أولية تحتوي على بيانات مستخدم وهمي
      user: { email: "test@example.com", name: "Test User", userType: "User" },
    },
  },
});

// مجموعة اختبارات لمكون AboutUs
describe("AboutUs Component", () => {
  // دالة مساعدة لعرض المكون مع Provider و MemoryRouter
  const renderWithProviders = (ui) =>
    render(
      <Provider store={mockStore}>
        {" "}
        {/* توفير store */}
        <MemoryRouter>{ui}</MemoryRouter> {/* توفير التوجيه */}
      </Provider>
    );

  // ✅ اختبار: عرض عنوان الصفحة الرئيسي
  it("renders the main title", () => {
    renderWithProviders(<AboutUs />); // عرض المكون مع البيئة المناسبة
    const heading = screen.getByRole("heading", {
      name: /about our university clinic/i, // البحث عن العنوان باستخدام نصه
    });
    expect(heading).toBeInTheDocument(); // التحقق من أن العنوان موجود
  });

  // ✅ اختبار: عرض صورة الفريق
  it("renders the team image", () => {
    renderWithProviders(<AboutUs />);
    const teamImage = screen.getByAltText(/team/i); // البحث عن الصورة من خلال alt
    expect(teamImage).toBeInTheDocument(); // التحقق من وجود الصورة
  });

  // ✅ اختبار: عرض عنوان قسم "What We Offer You With Us"
  it("renders the section 'What We Offer You With Us'", () => {
    renderWithProviders(<AboutUs />);
    const sectionTitle = screen.getByText(/what we offer you with us/i); // البحث عن عنوان القسم
    expect(sectionTitle).toBeInTheDocument(); // التحقق من ظهوره
  });
});
