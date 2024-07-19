import React, { useState } from 'react';
import { FaTh, FaUsers, FaCog, FaTable, FaCalendarAlt, FaBell, FaInfoCircle } from 'react-icons/fa';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Boards');

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
    <div className="w-57 gap-10 bg-gray-100 h-screen p-5 flex flex-col">
      <div className="flex justify-center items-center mb-5">
        <span className="w-10 flex justify-center items-center m-auto h-10 rounded-full bg-blue-700 font-bold text-white text-xl">AF</span>
      </div>
      <div className="flex-1">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className="mb-4 flex flex-col justify-center items-center text-gray-700 cursor-pointer"
              onClick={() => setActiveItem(item.name)}
            >
              <div className="flex gap-1 flex-col items-center">
                <span className={`mr-3 ${activeItem === item.name ? 'text-blue-700' : ''}`}>{item.icon}</span>
                <span className={` px-2 hover:bg-gray-200 rounded-md ${activeItem === item.name ? 'bg-blue-100 text-blue-700' : ''}`}>{item.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;