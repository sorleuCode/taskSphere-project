import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashHeader from './DashHeader';
import BoardMembershipTable from './BoardMembershipTable';
import MainContent from "./MainContent"

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('Boards'); // Initialize with 'Boards'

  useEffect(() => {
    // Optional: Any side-effects or data fetching when the component mounts
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar setSelectedMenu={setSelectedMenu} />
      <div className="flex-1 flex flex-col">
        <DashHeader />
        {selectedMenu === 'Members' && <BoardMembershipTable />}
        {/* Render other components based on selectedMenu */}
        {selectedMenu === 'Boards' && <MainContent/>}
        {selectedMenu === 'Settings' && <div>Settings Content</div>}
        {selectedMenu === 'Table' && <div>Table Content</div>}
        {selectedMenu === 'Calendar' && <div>Calendar Content</div>}
        {selectedMenu === 'Notifications' && <div>Notifications Content</div>}
        {selectedMenu === 'Information' && <div>Information Content</div>}
      </div>
    </div>
  );
};

export default Dashboard;
