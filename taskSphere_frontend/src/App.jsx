import React from 'react'
import LandinPage from './components/landingPage/LandinPage'
import 'aos/dist/aos.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';

const App = () => {
  return (
    <>

    <Routes>
      <Route path='/' element={<LandinPage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>


    </Routes>

      
    </>
  )
}

export default App
