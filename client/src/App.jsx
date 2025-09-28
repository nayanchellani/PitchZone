import "./App.css";
import Startingpoint from "./Pages/Startingpoint";
import Login from "./Pages/Login";
import CreateAcc from "./Pages/createAcc";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Pitches from "./Pages/Pitches";
import PitchDetail from "./Pages/PitchDetail";
import Leaderboard from "./Pages/Leaderboard";
import Profile from "./Pages/Profile";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Startingpoint/>,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/createaccount",
      element: <CreateAcc />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/pitches",
      element: <Pitches />,
    },
    {
      path: "/pitches/:id",
      element: <PitchDetail />,
    },
    {
      path: "/leaderboard",
      element: <Leaderboard />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
