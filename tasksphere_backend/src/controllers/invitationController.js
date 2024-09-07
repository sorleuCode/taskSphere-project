// POST /api/invitations/board/:boardId

import { boardModel } from "~/models/boardModel";
const User = require("../models/userModel");
const nodemailer = require("nodemailer");

const Invitation = require("../models/invitationModel");

const boardInvitation = async (req, res) => {
  const { boardId } = req.params;
  const { email } = req.body;

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7); // Set expiration date to 7 days from now

  try {
    const board = await boardModel.Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Check if the user exists
    let user = await User.findOne({ email });
    const inviter = await User.findById(board.creatorId);

    if (user) {
      // If the user is already a member
      if (board.memberIds.includes(user._id)) {
        return res
          .status(400)
          .json({ message: "User is already a member of this board" });
      }
    } else {
      // If the user doesn't exist, create a temporary invitation with the email
      user = { email }; // Placeholder for email
    }

    // Create an invitation
    const invitation = new Invitation({
      boardId,
      invitedUserId: user._id || null, // null if the user doesn't exist
      email: user.email,
      expirationDate
    });
    await invitation.save();

    // Generate a sign-up or invitation acceptance link
    let inviteLink;
    if (!user._id) {
      inviteLink = `${process.env.CLIENT_BASE_URL}/?invitationId=${invitation._id}`;
    } else {
      inviteLink = `${process.env.CLIENT_BASE_URL}/accept-invite/${invitation._id}`;
    }

    // Send the invitation email

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sorleu3@gmail.com",
        pass: "iwfi ozbb cucb mlfr",
      },
    });

    const mailConfigurations = {
      from: "sorleu3@gmail.com",
      to: user.email,
      subject: "Invitation request",
      text: `Hi! You have been invited by ${inviter.fullname} to join the board "${board.title}". Click the following link to accept the invitation: ${inviteLink}`,
    };

    transporter.sendMail(mailConfigurations, async function (error, info) {
      if (error) {
        return res
          .status(400)
          .json({
            message: `Error occured: ${error.message}`,
          });
      }
      

      return res.status(200).json({ message: "Invitation sent", invitation });
    });

    
  } catch (error) {
    console.error("Error in createInvitation:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const invitationAcceptance =  async (req, res) => {
  const { invitationId } = req.params;
  const { action } = req.body; // 'accept' or 'reject'

  try {
    const invitation = await Invitation.findById(invitationId);

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (!invitation.invitedUserId) {
      return res.status(400).json({ message: 'User needs to register first' });
    }

    if (action === 'accept') {
      // Add the user to the board's members
      const board = await boardModel.Board.findById(invitation.boardId);
      if (!board.memberIds.includes(invitation.invitedUserId)) {
        board.memberIds.push(invitation.invitedUserId);
        await board.save();
      }

      // Mark the invitation as accepted
      invitation.status = 'accepted';
      await invitation.save();

      const inviter = await User.findById(board.creatorId)

      const invitedUser = await User.findById(invitation.invitedUserId)
      // Send the invitation email

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sorleu3@gmail.com",
        pass: "iwfi ozbb cucb mlfr",
      },
    });

    const inviterName = inviter.fullname
    const mailConfigurations = {
      from: "sorleu3@gmail.com",
      to: inviter.email,
      subject: "Invitation response",
      text: `Hi ${inviterName}! This is to tell you that ${invitedUser.fullname} has accepted the invitation to join the board "${board.title}".`,
    };

    transporter.sendMail(mailConfigurations, async function (error, info) {
      if (error) {
        return res
          .status(400)
          .json({
            message: `Error occured: ${error.message}`,
          });
      }
      

      return res.status(200).json({ message: 'Invitation accepted', boardId: board._id });
    });


    } else if (action === 'reject') {
      // Mark the invitation as rejected
      invitation.status = 'rejected';
      await invitation.save();
      
      return res.status(400).json({ message: 'Invitation rejected' });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error });
  }
}

module.exports = { boardInvitation, invitationAcceptance};
