import React from "react";
import { Route, Routes } from "react-router-dom";
import "aos/dist/aos.css";

import Board from "./pages/Boards/_id";
import LandinPage from "./components/landingPage/LandinPage";
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import VerifyEmail from "./pages/verifyEmail/VerifyEmail";
import EmailVerificationNotice from "./components/landingPage/EmailVerificationNotice";
import GoogleCallback from "./components/landingPage/GoogleCallback";
import BoardInviteAcceptance from "./pages/Boards/BoardContent/BoardInviteAccetance";
import VideoMeetingPage from "./components/GroupVideoService/VideoMeetingPage";
import MeetingsList from "./components/GroupVideoService/MeetingsList";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

function App() {
  const { user, status } = useSelector((state) => state.user);

  const ProtectedRoute = ({ children }) => {
    if (!status && !user.emailVerified) {
      toast.error("You must log in");
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  // // redirect authenticated users to the home page
  // const RedirectAuthenticatedUser = ({ children }) => {
  //   const { isAuthenticated, user } = useAuthStore();

  //   if (isAuthenticated && user.isVerified) {
  //     return <Navigate to='/' replace />;
  //   }

  //   return children;
  // };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandinPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user/verify/:token" element={<VerifyEmail />} />
      <Route path="/user/verifyEmail" element={<EmailVerificationNotice />} />
      <Route path="/user/googlecbk" element={<GoogleCallback />} />
      <Route
        path="/accept-invite/:invitationId"
        element={<BoardInviteAcceptance />}
      />
      <Route path="board/card/:cardId/meetings" element={<MeetingsList />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/board/card/:cardId/meeting/:callId"
        element={
        <ProtectedRoute>
          <VideoMeetingPage />
        </ProtectedRoute>}
      />

      <Route
        path="/boards/board/:id"
        element={
          <ProtectedRoute>
            <Board />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
