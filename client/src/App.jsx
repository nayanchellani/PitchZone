import "./App.css";
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import CreateAccount from "./Pages/CreateAccount";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Pitches from "./Pages/Pitches";
import PitchDetail from "./Pages/PitchDetail";
import Leaderboard from "./Pages/Leaderboard";
import Profile from "./Pages/Profile";
import AdminDashboard from "./Pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "./context/ToastContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage/>,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/createaccount",
      element: <CreateAccount />,
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/pitches",
      element: (
        <ProtectedRoute>
          <Pitches />
        </ProtectedRoute>
      ),
    },
    {
      path: "/pitches/:id",
      element: (
        <ProtectedRoute>
          <PitchDetail />
        </ProtectedRoute>
      ),
    },
    {
      path: "/leaderboard",
      element: (
        <ProtectedRoute>
          <Leaderboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
