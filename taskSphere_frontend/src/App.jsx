import Board from "./pages/Boards/_id"
import React from 'react'
import LandinPage from './components/landingPage/LandinPage'
import 'aos/dist/aos.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import VerifyEmail from "./pages/verifyEmail/VerifyEmail";
import EmailVerificationNotice from "./components/landingPage/EmailVerificationNotice";
import GoogleCallback from "./components/landingPage/GoogleCallback";

function App() {
  return (
    <>
     
    <Routes>
      <Route path='/' element={<LandinPage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/board' element={<Board/>}/>
      <Route path='/user/verify/:token' element={<VerifyEmail/>}/>
      <Route path='/user/verifyEmail' element={<EmailVerificationNotice/>}/>
      <Route path='/user/googlecbk' element={<GoogleCallback/>}/>
    </Routes>
    </>
  )
}

export default App
