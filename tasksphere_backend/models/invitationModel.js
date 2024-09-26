const mongoose = require("mongoose");

const InvitationSchema = new mongoose.Schema({
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
    },
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
    },
    invitedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    expirationDate: {
        type: Date,
        required: true,
      },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    
  });
  
  const Invitation = mongoose.model('Invitation', InvitationSchema);

  module.exports = Invitation
  