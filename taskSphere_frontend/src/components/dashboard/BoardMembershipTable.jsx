import React, { useState, useEffect } from 'react';
import {useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import BoardMemberActionsModal from './dashModals/BoardMemberActionsModal'; // Adjust the import path as necessary
import { updateBoard, updateBoardMemberRole } from '../../redux/reducers/boardSlice';


const BoardMembershipTable = () => {
  const { boardsMembers, loading, error } = useSelector((state) => state.board);

  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

 

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right" });
    }else if (boardsMembers.length === 0) {
      toast.error("No members to display", { position: "top-right" });

    }


  }, [error]);

  const openModal = (member, board) => {
    setSelectedBoard(board)
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleRemoveMember = (member, board) => {
    console.log(`Remove member: ${member.name}`);

    if(member && board) {

      const memberIds = boardsMembers.map((member) => member._id).filter((id) => id !== member._id)
      const updatedBoardData = {memberIds}
      const boardId = board._id
      dispatch(updateBoard({boardId, updatedBoardData}))
    }

    // Add your remove logic here
  };

  const handleChangeRole = (member, board, role) => {

    if(member &&  board && role ) {
      const boardId = board._id;
      const updatedBoardData = {member, role};
      dispatch(updateBoardMemberRole({boardId, updatedBoardData}));
    }

  };

  

  if (loading) {
    return <p className="text-center py-6 text-blue-500">Fetching Members...</p>;
  }

  if (error || boardsMembers.length === 0
    
  ) {
    return <p className="text-center py-6 text-blue-500">No members to show.</p>;
  }

  return (
    <div className="relative overflow-x-auto pt-5">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Board Member Names
            </th>
            <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Board Member Emails
            </th>
            <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Board Names
            </th>
          </tr>
        </thead>
        <tbody>
          {boardsMembers.map((member, index) => (
            <tr key={index} className="border-t">
              <td className="py-4 px-6 text-sm text-gray-700">
                {member.fullname}
              </td>
              <td className="py-4 px-6 text-sm text-gray-700">
                {member.email}
              </td>
              <td className="py-4 px-6 text-sm">
                {member.boards.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {member.boards.map((board, i) => (
                      <span
                        key={i}
                        className="inline-block hover:bg-gray-100 rounded px-2 py-1 text-sm cursor-pointer text-gray-700"
                        onClick={() => openModal(member, board)} // Open modal on board click
                      >
                        {board.title}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span>No Boards</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedMember && (
        <BoardMemberActionsModal 
          member={selectedMember}
          board={selectedBoard}
          onRemove={handleRemoveMember} 
          onChangeRole={handleChangeRole} 
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default BoardMembershipTable;
