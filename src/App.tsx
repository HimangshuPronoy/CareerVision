
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
import LearningResources from "./pages/LearningResources";
import Settings from "./pages/Settings";
import { AuthProvider } from "./contexts/AuthContext";
import RouteGuard from "./components/RouteGuard";

// Create a client
const queryClient = new QueryClient();

// Define App as a function component to ensure hooks work correctly
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={
                <RouteGuard>
                  <Dashboard />
                </RouteGuard>
              } />
              <Route path="/trends" element={
                <RouteGuard>
                  <MarketTrends />
                </RouteGuard>
              } />
              <Route path="/profile" element={
                <RouteGuard>
                  <Profile />
                </RouteGuard>
              } />
              <Route path="/skills" element={
                <RouteGuard>
                  <Skills />
                </RouteGuard>
              } />
              <Route path="/career-paths" element={
                <RouteGuard>
                  <CareerPaths />
                </RouteGuard>
              } />
              <Route path="/resources" element={
                <RouteGuard>
                  <LearningResources />
                </RouteGuard>
              } />
              <Route path="/settings" element={
                <RouteGuard>
                  <Settings />
                </RouteGuard>
              } />
              <Route path="/login" element={
                <RouteGuard requireAuth={false}>
                  <Login />
                </RouteGuard>
              } />
              <Route path="/signup" element={
                <RouteGuard requireAuth={false}>
                  <Signup />
                </RouteGuard>
              } />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
