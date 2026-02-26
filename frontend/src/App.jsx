import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import MyMcq from "./pages/MyMcq";
import Landing from "./pages/Landing";
import Navbar from "./components/Navbar";

/* ---------------- Auth Helpers ---------------- */

const isAuthenticated = () => !!localStorage.getItem("token");

/* ---------------- Protected Route ---------------- */

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

/* ---------------- Public Route ---------------- */

const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" replace />;
};

/* ---------------- Smart Home Route ---------------- */

const HomeRoute = () => {
  return isAuthenticated()
    ? <Navigate to="/dashboard" replace />
    : <Landing />;
};

/* ---------------- Layout Wrapper ---------------- */

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0B0F1A] text-white">
        {children}
      </div>
    </>
  );
};

/* ---------------- App ---------------- */

function App() {
  return (
    <Router>
      <Routes>

        {/* Smart Home */}
        <Route path="/" element={<HomeRoute />} />

        {/* Public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <Layout>
                <Subjects />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <SubjectDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-mcqs"
          element={
            <ProtectedRoute>
              <Layout>
                <MyMcq />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;