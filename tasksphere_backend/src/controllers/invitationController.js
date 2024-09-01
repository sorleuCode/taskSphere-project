// POST /api/invitations/board/:boardId

import { boardModel } from '~/models/boardModel'

const Invitation = require("../models/invitationModel")




const createInvitation =  async (req, res) => {
    const { boardId } = req.params;
    const { userId, invitationMessage } = req.body; // Include the invitation message
  
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Set expiration date to 7 days from now
  
    try {
      const board = await boardModel.Board.findById(boardId);
      if (!board) {
        return res.status(404).json({ message: 'Board not found' });
      }
  
      if (board.memberIds.includes(userId)) {
        return res.status(400).json({ message: 'User is already a member of this board' });
      }
  
      // Create a pending invitation with a message and expiration date
      const invitation = new Invitation({
        boardId,
        invitedUserId: userId,
        invitationMessage: invitationMessage || '', // Default to an empty string if no message
        expirationDate,
      });
      await invitation.save();
  
      res.status(200).json({ message: 'Invitation sent', invitation });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  module.exports =  {createInvitation}