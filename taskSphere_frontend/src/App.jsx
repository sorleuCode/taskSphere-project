import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'aos/dist/aos.css';

import Board from './pages/Boards/_id';
import LandinPage from './components/landingPage/LandinPage';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import VerifyEmail from './pages/verifyEmail/VerifyEmail';
import EmailVerificationNotice from './components/landingPage/EmailVerificationNotice';
import GoogleCallback from './components/landingPage/GoogleCallback';
import BoardInviteAcceptance from './pages/Boards/BoardContent/BoardInviteAccetance';
import VideoMeetingPage from './components/GroupVideoService/VideoMeetingPage';
import MeetingsList from './components/GroupVideoService/MeetingsList';
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandinPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user/verify/:token" element={<VerifyEmail />} />
      <Route path="/user/verifyEmail" element={<EmailVerificationNotice />} />
      <Route path="/user/googlecbk" element={<GoogleCallback />} />
      <Route path="/accept-invite/:invitationId" element={<BoardInviteAcceptance />} />
      <Route path='/board/card/:cardId/meeting/:callId'  element={<VideoMeetingPage/>}/>
      <Route path='board/card/:cardId/meetings'  element={<MeetingsList/>}/>

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
            <Dashboard />
        }
      />
      <Route
        path="/boards/board/:id"
        element={
            <Board />
        }
      />
    </Routes>
  );
}

export default App;
