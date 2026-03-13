import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Layout } from "./modules/app/components/layout.component";
import { AppWrapper } from "./modules/app/components/app-wrapper.component";
import { AppState, useAppDispatch } from "./modules/store/store";
import { LoginForm } from "./modules/user/components/login-form.component";
import { RegisterForm } from "./modules/user/components/register-form.component";
import { ProfilePage } from "./modules/user/components/profile-page.component";
import { OtpSetup } from "./modules/user/components/otp-setup.component";
import { logoutThunk } from "./modules/store/auth.actions";
import { AnalyticsDashboard } from "./modules/dashboard/analytics-dashboard.component";

const EventDetail = lazy(
  () => import("./modules/events/event-detail.component"),
);
const EventList = lazy(() => import("./modules/events/event-list.component"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function Navbar() {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <div className="nav">
      <div className="brand">EventHub</div>

      <div className="links">
        {!isAuthenticated ? (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => `link ${isActive ? "active" : ""}`}
            >
              Connexion
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) => `link ${isActive ? "active" : ""}`}
            >
              Inscription
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) => `link ${isActive ? "active" : ""}`}
            >
              Événements
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) => `link ${isActive ? "active" : ""}`}
            >
              Profil
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) => `link ${isActive ? "active" : ""}`}
            >
              Événements
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `link ${isActive ? "active" : ""}`}
            >
              Dashboard
            </NavLink>
          </>
        )}
      </div>

      <div className="spacer" />

      {isAuthenticated ? (
        <button
          className="btn btnGhost"
          type="button"
          onClick={() => dispatch(logoutThunk())}
        >
          Déconnexion
        </button>
      ) : null}
    </div>
  );
}

export default function App() {
  return (
    <AppWrapper>
      <Layout>
        <Navbar />

        <div className="container fade-in">
          {/* MENU */}

          {/* CONTENT */}
          <div className="page" style={{ gridTemplateColumns: "1fr" }}>
            <Routes>
              {/* Default */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Auth */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route
                path="/events"
                element={
                  <Suspense fallback={<div>Chargement des événements...</div>}>
                    <EventList />
                  </Suspense>
                }
              />
              <Route
                path="/events/:id"
                element={
                  <Suspense fallback={<div>Chargement de l'événement...</div>}>
                    <EventDetail />
                  </Suspense>
                }
              />

              {/* Protected */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile/security"
                element={
                  <ProtectedRoute>
                    <OtpSetup />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AnalyticsDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </Layout>
    </AppWrapper>
  );
}
