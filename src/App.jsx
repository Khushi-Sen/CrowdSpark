import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignDetail from "./pages/CampaignDetail";
import Navbar from "./components/Navbar";
import PaymentPage from './pages/paymentpage';
import AdminDashboard from './pages/AdminDashboard';
import NotAuthorized from './pages/NotAuthorized'

function App() {
  const location = useLocation();

  return (
    <div className="bg-primary min-h-screen text-gray-900">
      {!['/', '/login', '/register'].includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />

      </Routes>
    </div>
  );
}

export default App;
