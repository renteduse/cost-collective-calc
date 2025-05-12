
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import GroupsPage from "./pages/groups/GroupsPage";
import CreateGroupPage from "./pages/groups/CreateGroupPage";
import JoinGroupPage from "./pages/groups/JoinGroupPage";
import GroupDetailPage from "./pages/groups/GroupDetailPage";
import CreateExpensePage from "./pages/expenses/CreateExpensePage";
import EditExpensePage from "./pages/expenses/EditExpensePage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import AboutPage from "./pages/AboutPage";
import FAQsPage from "./pages/FAQsPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import HowItWorksPage from "./pages/HowItWorksPage";

// Initialize QueryClient for React Query
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Group Routes */}
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/new" element={<CreateGroupPage />} />
            <Route path="/groups/join" element={<JoinGroupPage />} />
            <Route path="/groups/:groupId" element={<GroupDetailPage />} />
            
            {/* Expense Routes */}
            <Route path="/groups/:groupId/expenses/new" element={<CreateExpensePage />} />
            <Route path="/groups/:groupId/expenses/:expenseId/edit" element={<EditExpensePage />} />
            
            {/* Redirect /index to home */}
            <Route path="/index" element={<Navigate to="/" replace />} />
            
            {/* Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
