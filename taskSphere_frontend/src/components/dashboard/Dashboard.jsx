import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashHeader from './DashHeader';
import BoardMembershipTable from './BoardMembershipTable';
import MainContent from "./MainContent"
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllboardMembers } from '../../redux/reducers/boardSlice';




const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('Boards'); // Initialize with 'Boards'
  const { boardsMembers, loading, error } = useSelector((state) => state.board);
  const dispatch = useDispatch()


  
  useEffect(() => {
    if (boardsMembers.length === 0){

      dispatch(fetchAllboardMembers());
    }
  }, [dispatch, boardsMembers.length]);


  return (
    <div className="flex max-h-screen">
      <Sidebar setSelectedMenu={setSelectedMenu} />
      <div className="flex-1 flex flex-col">
        <DashHeader />
        {selectedMenu === 'Members' && <BoardMembershipTable />}
        {/* Render other components based on selectedMenu */}
        {selectedMenu === 'Boards' && <MainContent/>}
        {selectedMenu === 'Table' && <div>Table Content</div>}
        {selectedMenu === 'Calendar' && <div>Calendar Content</div>}
        {selectedMenu === 'Notifications' && <div>Notifications Content</div>}
      </div>
    </div>
  );
};

export default Dashboard;
