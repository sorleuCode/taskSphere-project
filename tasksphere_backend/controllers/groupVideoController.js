const { StreamClient } = require("@stream-io/node-sdk");
const cardModel = require("../models/cardModel");

const getStreamToken = async (req, res) => {
  

  const userId = req.user?._id.toString();
  const { cardId } = req.params;

  try {
    if (!process.env.STREAM_API_KEY || ! process.env.STREAM_SECRET_KEY
    ) {
      return res.status(500).json({ message: "Invalid credentials" });
    }

    if (!userId) {
      return res.status(500).json({ message: "User not authenticated" });
    }

    const card = await cardModel.Card.findById(cardId).populate('memberIds', 'fullname image profileImage');
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Get members' details
    const cardMembers = card.memberIds.map(member => ({
      id: member._id.toString(),
      role: 'user',
      name: member.fullname,
      image: member.profileImage ? member.profileImage : " "
    }));

    // Ensure the user is included
    const members = [
      ...cardMembers,
      {
        id: userId,
        role: 'user',
        name: req.user.fullname,
        image: req.user.profileImage,
      }
    ].filter((v, i, a) => a.findIndex(v2 => v2.id === v.id) === i);

    // Validate members data
    if (members.some(member => !member.id || !member.name)) {
      return res.status(400).json({ message: 'Some members have missing data' });
    }

    const streamClient = new StreamClient(apiKey, apiSecret, { timeout: 3000 });

    // Upsert users
  // Create token
  const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour expiration

    const token = streamClient.generateCallToken({user_id: userId, validity_in_seconds: expirationTime});

    console.log("members", members)

      await streamClient.upsertUsers([...members]);
    

  

    return res.status(200).json({ token, members });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
}

module.exports = { getStreamToken };
