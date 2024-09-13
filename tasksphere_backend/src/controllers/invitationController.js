// POST /api/invitations/board/:boardId

import { boardModel } from "~/models/boardModel";
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars'); 

const Invitation = require("../models/invitationModel");



const boardInvitation = async (req, res) => {
  const { boardId } = req.params;
  const { email } = req.body;

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7); 

  try {
    const board = await boardModel.Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Check if the user exists
    let user = await User.findOne({ email });
    const inviter = await User.findById(board.creatorId);

    let isNewUser = false; // Initialize as false for existing users

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
      isNewUser = true; // New user flag set to true
    }

    // Create an invitation
    const invitation = new Invitation({
      boardId,
      invitedUserId: user._id || null, // null if the user doesn't exist
      email: user.email,
      expirationDate
    });
    await invitation.save();

    let newUserLink = `${process.env.CLIENT_BASE_URL}/?invitationId=${invitation._id}`;
    let existingUserLink = `${process.env.CLIENT_BASE_URL}/accept-invite/${invitation._id}`;

    const filePath = path.join(__dirname, 'EmailViews', 'inviteEmailTemplate.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    
    const template = handlebars.compile(source);
    const replacements = {
      inviteeName: user.fullname?.split(' ')[0] || email.split('@')[0], // Extracting name from email
      inviterName: inviter.fullname,
      boardTitle: board.title,
      newUserLink,
      existingUserLink,
      isNewUser, // Pass the flag to the template
    };
    const htmlToSend = template(replacements);

    // Send the invitation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sorleu3@gmail.com",
        pass: "iwfi ozbb cucb mlfr"
        
      },
    });

    const mailConfigurations = {
      from: "sorleu3@gmail.com",
      to: user.email,
      subject: `Invitation to join ${board.title}`,
      html: htmlToSend, // Sending the HTML template
    };

    transporter.sendMail(mailConfigurations, async function (error, info) {
      if (error) {
        return res
          .status(400)
          .json({ message: `Error occurred: ${error.message}` });
      }

      return res.status(200).json({ message: "Invitation sent", invitation });
    });

  } catch (error) {
    console.error("Error in createInvitation:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const invitationAcceptance = async (req, res) => {
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

      const inviter = await User.findById(board.creatorId);
      const invitedUser = await User.findById(invitation.invitedUserId);

      // Load the HTML template
      const filePath = path.join(__dirname, 'EmailViews', 'inviteResponseTemplate.html');
      const source = fs.readFileSync(filePath, 'utf-8').toString();

      // Compile the template with Handlebars
      const template = handlebars.compile(source);
      const replacements = {
        inviterName: inviter.fullname,
        invitedUserName: invitedUser.fullname,
        boardTitle: board.title,
        accepted: true, // Mark as accepted
      };
      const htmlToSend = template(replacements);

      // Set up Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: "sorleu3@gmail.com",
        pass: "iwfi ozbb cucb mlfr"
        },
      });

      // Email configurations
      const mailConfigurations = {
        from: process.env.EMAIL_USER,
        to: inviter.email,
        subject: 'Invitation response',
        html: htmlToSend, // Send the compiled HTML
      };

      // Send the email
      transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) {
          return res.status(400).json({ message: `Error occurred: ${error.message}` });
        }

        return res.status(200).json({ message: 'Invitation accepted', boardId: board._id });
      });
    } else if (action === 'reject') {
      // Mark the invitation as rejected
      invitation.status = 'rejected';
      await invitation.save();

      // Load the HTML template
      const filePath = path.join(__dirname, 'EmailViews', 'inviteResponseTemplate.html');
      const source = fs.readFileSync(filePath, 'utf-8').toString();

      // Compile the template with Handlebars
      const template = handlebars.compile(source);
      const replacements = {
        inviterName: inviter.fullname,
        invitedUserName: invitedUser.fullname,
        boardTitle: board.title,
        accepted: false, // Mark as rejected
      };
      const htmlToSend = template(replacements);

      // Set up Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: "sorleu3@gmail.com",
        pass: "iwfi ozbb cucb mlfr"
        },
      });

      // Email configurations
      const mailConfigurations = {
        from: process.env.EMAIL_USER,
        to: inviter.email,
        subject: 'Invitation response',
        html: htmlToSend, // Send the compiled HTML
      };

      transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) {
          return res.status(400).json({ message: `Error occurred: ${error.message}` });
        }

        return res.status(400).json({ message: 'Invitation rejected' });
      });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { boardInvitation, invitationAcceptance};
