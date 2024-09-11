import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const BoardMemberActionsModal = ({ member, board, onRemove, onChangeRole, closeModal }) => {
  const [role, setRole] = useState('member'); // Default role

  const handleRemove = () => {

    onRemove(member, board);
    closeModal(); // Close modal after action
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const submitRoleChange = () => {
    onChangeRole(member, board, role);
    closeModal(); // Close modal after action
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Actions for {member.name}</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Change Role</label>
            <select 
              value={role} 
              onChange={handleRoleChange} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
          <div className=' w-full flex justify-center items-center gap-3'>

          <button 
              onClick={submitRoleChange} 
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Change Role
            </button>
            <button 
              onClick={handleRemove} 
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Remove Member
            </button>

          </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardMemberActionsModal;
