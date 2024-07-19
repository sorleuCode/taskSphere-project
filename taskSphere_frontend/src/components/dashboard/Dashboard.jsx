import React from 'react'
import Sidebar from './Sidebar'
import DashHeader from './DashHeader'
import MainContent from './MainContent'

const Dashboard = () => {
    return (

        <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <DashHeader />
          <MainContent />
        </div>
      </div>
    )
}

export default Dashboard
