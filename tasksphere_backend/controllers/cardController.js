
const { StatusCodes } = require('http-status-codes')
const cardModel = require('../models/cardModel')
const cardService = require('../services/cardService')
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) { next(error) }
}

const updateCard = async (req, res, next) => {

  try {

    if (req.body?.boardId) {
      const { boardId, ...newdata } = req.body

      const updatedCard = await cardService.updateCard(req.params.cardId, newdata)

      return res.status(StatusCodes.CREATED).json(updatedCard)
    }

    const updatedCard = await cardService.updateCard(req.params.cardId, req.body)

    return res.status(StatusCodes.CREATED).json(updatedCard)





  } catch (error) {
    next(error)
  }
}

const findOneById = async (req, res) => {
  try {
    const card = await cardModel.findOneById(req.params.cardId);

    if (card) {
      res.status(StatusCodes.OK).json(card)
    }
    res.status(500).json({ message: "no card found" })
  } catch (error) {
    throw (error)
  }
}

const getAllcardsDetails = async (req, res) => {
  try {

    const cards = await cardModel.Card.find({ boardId: req.params.boardId });
    if (cards) {
      res.status(StatusCodes.OK).json(cards)
    }
    else {

      res.status(500).json({ message: "no cards found" })
    }
  } catch (error) {
    res.json(error.message)
  }
}



const getCardMembers = async (req, res) => {
  const { cardId } = req.params;
  console.log("cardId", cardId)

  try {
    // Find the card by ID and populate the 'memberIds' with user details
    const card = await cardModel.Card.findById(cardId).populate({
      path: 'memberIds',
      select: 'name email _id'
    });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.status(200).json({ members: card.memberIds });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// due date remainder

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "sorleu3@gmail.com",
    pass: "iwfi ozbb cucb mlfr"
  },
});

const sendDueDateReminders = async () => {
  try {
    const currentDate = new Date();

    // Find cards with due dates within the next 24 hours
    const cards = await cardModel.Card.find({
      dueDate: {
        $gte: currentDate,
        $lte: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    }).populate('memberIds');

    // Load the HTML template
    const filePath = path.join(__dirname, 'EmailViews', 'dueDateReminderTemplate.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();

    // Compile the template with Handlebars
    const template = handlebars.compile(source);

    for (const card of cards) {
      const dueDate = new Date(card.dueDate).toDateString();

      for (const member of card.memberIds) {
        const user = await User.findById(member._id);
        if (user && user.email) {

          // Prepare the replacements for the template
          const replacements = {
            userName: user.name,
            cardTitle: card.title,
            dueDate: dueDate,
          };

          // Generate the final HTML email content
          const htmlToSend = template(replacements);

          // Send the email
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Reminder: Task Due Soon - ${card.title}`,
            html: htmlToSend,
          };

          await transporter.sendMail(mailOptions);
          console.log(`Reminder email sent to ${user.email}`);
        }
      }
    }
  } catch (error) {
    console.error('Error sending reminder emails:', error);
  }
};

// Schedule the cron job to run every hour
cron.schedule('0 */12  * * *', () => {
  console.log('Running the cron job to send due date reminders');
  sendDueDateReminders();
});


const sendMeetingInvite = async (req, res) => {
  const { cardId, meetingLink, startTime } = req.body;

  try {
    // Fetch the card details and members from the cardId
    const card = await cardModel.Card.findById(cardId).populate('memberIds', 'email name');

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Get all members' emails
    const memberEmails = card.memberIds.map(member => member.email);


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "sorleu3@gmail.com",
        pass: "iwfi ozbb cucb mlfr"
      },
    });
    // Load the HTML template
    const filePath = path.join(__dirname, 'EmailViews', 'videoMeetingNotif.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();

    // Compile the template using Handlebars
    const template = handlebars.compile(source);

    // Define dynamic content for the email
    const replacements = {
      greeting: 'Dear Board Member',
      cardTitle: card.title,
      meetingLink: meetingLink,
      startTime: startTime,
      schedulerName: req.user.fullname // The scheduler is the authenticated user
    };

    // Generate the HTML with replacements
    const htmlToSend = template(replacements);

    // Prepare email options
    const mailOptions = {
      from: "sorleu3@gmail.com",
      to: memberEmails, // Array of member emails
      subject: `Meeting Scheduled for the project: ${card.title}`,
      html: htmlToSend
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Meeting invitation sent successfully.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to send meeting invitation.', error: error.message });
  }
};






const cardController = {
  createNew, getAllcardsDetails, updateCard, findOneById, getCardMembers, sendMeetingInvite
}
module.exports = cardController