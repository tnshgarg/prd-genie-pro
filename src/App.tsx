import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ThemeProvider } from "@/components/theme-provider";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/app/login/page";
import SignupPage from "@/app/signup/page";
import DashboardPage from "@/app/dashboard/page";
import GeneratePage from "@/app/generate/page";
import PRDPage from "@/pages/prd/PRDPage";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="prd-genie-theme">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generate"
            element={
              <ProtectedRoute>
                <GeneratePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prd/:id"
            element={
              <ProtectedRoute>
                <PRDPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}
