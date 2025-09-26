import "./App.css";
import Startingpoint from "./Pages/Startingpoint";
import Signup from "./Pages/Signup";
import CreateAcc from "./Pages/createAcc";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Pitches from "./Pages/Pitches";
import Leaderboard from "./Pages/Leaderboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Startingpoint/>,
    },
    {
      path: "/login",
      element: <Signup />,
    },
    {
      path: "/CreateAccount",
      element: <CreateAcc />,
    },
    {
      path: "/Home",
      element: <Home />
    },
    {
      path: "/dashboard",
      element: <Dashboard />
    },
    {
      path: "/pitches",
      element: <Pitches />
    },
    {
      path: "/leaderboard",
      element: <Leaderboard />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
