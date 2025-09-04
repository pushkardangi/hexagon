import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store";
import LogoutModal from "./components/Common/LogoutModal";

const Auth = lazy(() => import("./layouts/Auth"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const LoadingScreen = lazy(() => import("./components/Common/LoadingScreen"));

const Home = lazy(() => import("./layouts/Home"));
const CreateImage = lazy(() => import("./pages/CreateImage"));
const Gallery = lazy(() => import("./pages/Gallery"));
const BillingOptions = lazy(() => import("./pages/BillingOptions"));
const UserProfile = lazy(() => import("./components/Profile/ProfileContainer"));
const Documentation = lazy(()=> import("./pages/Documentation/Documentation"));
const FeatureRequest = lazy(()=> import("./pages/FeatureRequest/FeatureRequest"));
const ReportBug = lazy(()=> import("./pages/ReportBug/ReportBug"));
const WhatsNew = lazy(()=> import("./pages/WhatsNew/WhatsNew"));

const AdminLayout = lazy(() => import("./layouts/Admin"));
const UserManagement = lazy(() => import("./pages/Admin/User/UserManagement"));
const RedeemCodeManagement = lazy(() => import("./pages/Admin/RedeemCode/RedeemCodeManagement"));
const ImagesManagement = lazy(() => import("./pages/Admin/Images/ImagesManagement"));

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/auth/login" />;
};

const App = () => {
  return (
    <>
      <Toaster
        position="bottom-left"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: "0.9rem",
            maxWidth: "100%",
          },
        }}
      />

      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            >
              <Route index element={<CreateImage />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="billing" element={<BillingOptions />} />
              <Route path="documentation" element={<Documentation />} />
              <Route path="feature-request" element={<FeatureRequest />} />
              <Route path="report-bug" element={<ReportBug />} />
              <Route path="whats-new" element={<WhatsNew />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/auth" element={<Auth />}>
              <Route index path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route path="users" element={<UserManagement />} />
              <Route path="redeem-codes" element={<RedeemCodeManagement />} />
              <Route path="images" element={<ImagesManagement />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          <LogoutModal />
        </Suspense>
      </Router>
    </>
  );
};

export default App;
