import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOnboarding from "./pages/admin/AdminOnboarding";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import UserDashboard from "./pages/portal/UserDashboard";
import UserBeneficiaries from "./pages/portal/UserBeneficiaries";
import UserTransactions from "./pages/portal/UserTransactions";
import UserDocuments from "./pages/portal/UserDocuments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Business Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/onboarding" element={<AdminOnboarding />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* Business User Routes */}
          <Route path="/portal" element={<UserDashboard />} />
          <Route path="/portal/beneficiaries" element={<UserBeneficiaries />} />
          <Route path="/portal/transactions" element={<UserTransactions />} />
          <Route path="/portal/documents" element={<UserDocuments />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
