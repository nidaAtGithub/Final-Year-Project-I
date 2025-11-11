import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import Signin from "./pages/citizen/Signin"; 
import FileFir from "./pages/citizen/FileFir";
import MyFirs from "./pages/citizen/MyFirs";
import TrackStatus from "./pages/citizen/TrackStatus";
import Notifications from "./pages/citizen/Notifications";
import Profile from "./pages/citizen/Profile";
import AIChatbot from "./pages/citizen/AIChatbot";
import PoliceDashboard from "./pages/police/PoliceDashboard";
import PendingFirs from "./pages/police/PendingFirs";
import ApprovedFirs from "./pages/police/ApprovedFirs";
import UnderInvestigation from "./pages/police/UnderInvestigation";
import ActiveCases from "./pages/police/ActiveCases";
import ClosedCases from "./pages/police/ClosedCases";
import SearchFirs from "./pages/police/SearchFirs";
import PoliceNotifications from "./pages/police/PoliceNotifications";
import PoliceProfile from "./pages/police/PoliceProfile";
import Analytics from "./pages/police/Analytics";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import FirManagement from "./pages/admin/FirManagement";
import PoliceAssignment from "./pages/admin/PoliceAssignment";
import BlockchainLedger from "./pages/admin/BlockchainLedger";
import AIMonitoring from "./pages/admin/AIMonitoring";
import Reports from "./pages/admin/Reports";
import SystemLogs from "./pages/admin/SystemLogs";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/AuthContext"; 
import { Outlet } from "react-router-dom";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/:role/Signin" element={<Signin />} />

            {/* Citizen Routes */}
            <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
            <Route path="/citizen/dashboard/file-fir" element={<FileFir />} />
            <Route path="/citizen/dashboard/my-firs" element={<MyFirs />} />
            <Route path="/citizen/dashboard/track-status" element={<TrackStatus />} />
            <Route path="/citizen/dashboard/notifications" element={<Notifications />} />
            <Route path="/citizen/dashboard/profile" element={<Profile />} />
            <Route path="/citizen/dashboard/ai-chatbot" element={<AIChatbot />} />

            {/* Police Routes */}
            <Route path="/police/dashboard" element={<PoliceDashboard />} />
            <Route path="/police/dashboard/pending" element={<PendingFirs />} />
            <Route path="/police/dashboard/approved" element={<ApprovedFirs />} />
            <Route path="/police/dashboard/investigation" element={<UnderInvestigation />} />
            <Route path="/police/dashboard/active" element={<ActiveCases />} />
            <Route path="/police/dashboard/closed" element={<ClosedCases />} />
            <Route path="/police/dashboard/search" element={<SearchFirs />} />
            <Route path="/police/dashboard/notifications" element={<PoliceNotifications />} />
            <Route path="/police/dashboard/profile" element={<PoliceProfile />} />
            <Route path="/police/dashboard/analytics" element={<Analytics />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/dashboard/users" element={<UserManagement />} />
            <Route path="/admin/dashboard/firs" element={<FirManagement />} />
            <Route path="/admin/dashboard/assignments" element={<PoliceAssignment />} />
            <Route path="/admin/dashboard/blockchain" element={<BlockchainLedger />} />
            <Route path="/admin/dashboard/ai" element={<AIMonitoring />} />
            <Route path="/admin/dashboard/reports" element={<Reports />} />
            <Route path="/admin/dashboard/logs" element={<SystemLogs />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
       </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;


