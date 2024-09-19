import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import BoardMemberActionsModal from './dashModals/BoardMemberActionsModal'; // Adjust the import path as necessary
import { updateBoard, updateBoardMemberRole } from '../../redux/reducers/boardSlice';
import { fetchAllCards, updateCard } from '../../redux/reducers/cardSlice';
import { fetchAllboardMembers } from '../../redux/reducers/boardSlice';

const BoardMembershipTable = () => {
  const { boardsMembers, loading, error } = useSelector((state) => state.board);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cards } = useSelector((state) => state.card);
  const dispatch = useDispatch();

  let cardToUpdate;
  let cardId;
  if (selectedMember) {
    cardToUpdate = cards?.filter((card) => card.memberIds.includes(selectedMember?._id));
    cardId = cardToUpdate._id;
  }

  useEffect(() => {
    if (boardsMembers.length === 0){

      dispatch(fetchAllboardMembers());
    }
  }, [dispatch, boardsMembers.length]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right' });
    } else if (boardsMembers.length === 0) {
      toast.error('No members to display', { position: 'top-right' });
    }
  }, [error]);

  useEffect(() => {
    if (selectedBoard?._id) {
      dispatch(fetchAllCards(selectedBoard?._id));
    }
  }, [dispatch, selectedBoard?._id]);

  const openModal = (member, board) => {
    setSelectedBoard(board);
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleRemoveMember = async (member, board) => {
    if (member && board) {
      const memberIds = boardsMembers
        .map((m) => m._id)
        .filter((id) => id !== member._id);

      const updatedBoardData = { memberIds };
      const boardId = board._id;

      // Filter cards associated with the board and the member being removed
      const cardsToUpdate = cards.filter(
        (card) => card.boardId === boardId && card.memberIds.includes(member._id) 
      );

      // Loop through each card and update the memberIds array
      for (const card of cardsToUpdate) {
        const updatedCard = {
          memberIds: card.memberIds.filter((id) => id !== member._id),
        };
        const cardId = card._id;

        await dispatch(updateCard({ cardId, updatedCard })).unwrap();
      }

      // Now update the board
      await dispatch(updateBoard({ boardId, updatedBoardData })).unwrap();
    }
  };

  const handleChangeRole = (member, board, role) => {
    if (member && board && role) {
      const boardId = board._id;
      const updatedBoardData = { member, role };
      dispatch(updateBoardMemberRole({ boardId, updatedBoardData }));
    }
  };

  if (loading) {
    return <p className="text-center py-6 text-blue-500">Fetching Members...</p>;
  }

  if (error || boardsMembers.length === 0) {
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
            <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Role
            </th>
          </tr>
        </thead>
        <tbody>
          {boardsMembers.map((member, index) => (
            <tr key={index} className="border-t">
              <td className="py-4 px-6 text-sm text-gray-700">{member.fullname}</td>
              <td className="py-4 px-6 text-sm text-gray-700">{member.email}</td>
              <td className="py-4 px-6 text-sm">
                {member.boards.length > 0 ? (
                  <div className="flex flex-wrap flex-col">
                    {member.boards.map((board, i) => (
                      <span
                        key={i}
                        className="block w-fit hover:bg-gray-100 rounded px-2 py-1 text-sm cursor-pointer text-gray-700"
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
              <td className="py-4 px-6 text-sm text-gray-700">
              <div className='flex flex-wrap flex-col'>

                {/* Display role for each board */}
              {member.boards.map((board, i) => (
                  <span key={i} className="block py-1">
                    {board.role}
                  </span>
                ))}

              </div>
                
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
