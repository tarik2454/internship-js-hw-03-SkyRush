import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthLayout } from "@/layouts/AuthLayout";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { GameLayout } from "@/layouts/GameLayout";
import { Game } from "@/pages/Game";
import { Leaderboard } from "@/pages/Leaderboard";
import { Bonuses } from "@/pages/Bonuses";
import { Profile } from "@/pages/Profile";
import { History } from "@/pages/History";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route index element={<Navigate to="/auth/login" replace />} />
        </Route>

        <Route path="/" element={<GameLayout />}>
          <Route index element={<Game />} />
          <Route path="history" element={<History />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="bonuses" element={<Bonuses />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>

      <ToastContainer autoClose={2000} transition={Slide} />
    </Router>
  );
}

export default App;
