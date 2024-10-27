import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { inviteBoardMember } from '../../../../redux/reducers/inviteSlice';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

const BoardInvitation = ({ board, handleInviteBtn }) => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { inviteSuccess, inviteError, loading } = useSelector((state) => state.invitation);

  useEffect(() => {
    if (inviteSuccess) {
      toast.success('Invitation sent successfully!', { position: "top-right" });
      handleInviteBtn(false);
    } else if (inviteError) {
      toast.error(inviteError, { position: "top-right" });
    }
  }, [inviteSuccess, inviteError]);

  const handleInvite = (e) => {
    e.preventDefault();
    const boardId = board._id;
    const inviteData = { email: email.toLowerCase() };

    if (inviteData?.email.includes("@")) {
      dispatch(inviteBoardMember({ boardId, inviteData }));
    } else {
      toast.error("Enter a valid email!", { position: "top-right" });
    }
  };

  return (
    <form onSubmit={handleInvite} className="relative mt-5 p-4 bg-white shadow-lg rounded-lg w-80 md:w-96 z-10 text-center">
      <button 
        type="button" 
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={() => handleInviteBtn(false)}
      >
        <FaTimes size={20} />
      </button>
      <input
        type="email"
        required
        className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Enter email to invite"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="w-[50%] p-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors duration-200">
        {loading ? (
          <div className="spinner"></div>
        ) : (
          "Invite"
        )}
      </button>
    </form>
  );
};

export default BoardInvitation;
