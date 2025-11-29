import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthLayout } from "./layouts/AuthLayout";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { ProtectedRoute } from "./shared/ProtectedRoute";
import { initAuthToken } from "./config/authApi";

// Initialize auth token from localStorage on app startup
initAuthToken();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route index element={<Navigate to="/auth/login" replace />} />
        </Route>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
