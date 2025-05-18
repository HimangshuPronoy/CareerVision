import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MarketTrends from "./pages/MarketTrends";
import Skills from "./pages/Skills";
import CareerPaths from "./pages/CareerPaths";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Settings from "./pages/Settings";
import ResumeBuilder from "./pages/ResumeBuilder";
import { AuthProvider } from "./contexts/AuthContext";
import RouteGuard from "./components/RouteGuard";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />

              {/* Protected routes that require authentication */}
              <Route path="/dashboard" element={<RouteGuard><Dashboard /></RouteGuard>} />
              <Route path="/profile" element={<RouteGuard><Profile /></RouteGuard>} />
              <Route path="/settings" element={<RouteGuard><Settings /></RouteGuard>} />
              <Route path="/trends" element={<RouteGuard><MarketTrends /></RouteGuard>} />
              <Route path="/skills" element={<RouteGuard><Skills /></RouteGuard>} />
              <Route path="/career-paths" element={<RouteGuard><CareerPaths /></RouteGuard>} />
              <Route path="/resume-builder" element={<RouteGuard><ResumeBuilder /></RouteGuard>} />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
