import React, { useState } from 'react';
import { FaTh, FaUsers, FaCog, FaTable, FaCalendarAlt, FaBell, FaInfoCircle } from 'react-icons/fa';

const Sidebar = ({ setSelectedMenu }) => {
  const [activeItem, setActiveItem] = useState('');

  const handleClick = (target) => {
    setActiveItem(target);
    setSelectedMenu(target); // Pass the selected menu item to parent
  };

  const menuItems = [
    { name: 'Boards', icon: <FaTh /> },
    { name: 'Members', icon: <FaUsers /> },
    { name: 'Settings', icon: <FaCog /> },
    { name: 'Table', icon: <FaTable /> },
    { name: 'Calendar', icon: <FaCalendarAlt /> },
    { name: 'Notifications', icon: <FaBell /> },
    { name: 'Information', icon: <FaInfoCircle /> },
  ];

  return (
    <div className="w-57 gap-10 bg-gray-50 h-screen p-5 flex flex-col text-black">
      <div className="flex justify-center items-center mb-5">
        <img src="" alt="" />
        <span className='font-bold text-lg'>Tasksphere</span>
      </div>
      <div className="flex-1">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className="mb-4 flex flex-col justify-center items-center text-gray-700 cursor-pointer"
              onClick={() => handleClick(item.name)}
            >
              <div className="flex gap-1 flex-col items-center">
                <span className={`mr-3 ${activeItem === item.name ? 'text-blue-500' : ''}`}>{item.icon}</span>
                <span className={`px-2 hover:bg-gray-200 rounded-md ${activeItem === item.name ? 'bg-blue-100 text-blue-500' : ''}`}>{item.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
