
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
import { boardModel } from '~/models/boardModel'
const User = require("../models/userModel")


const createNew = async (req, res, next) => {
  try {
   
    const allData = {...req.body, creatorId: req.user._id}
    const createdBoard = await boardService.createNew(allData)

    console.log("controller", createdBoard)

    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    
    const board = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}



const getAllboardsDetails = async (req, res) => {
  try {

      const boards = await boardModel.Board.find({creatorId: req.user._id});

      if(boards) {
        res.status(StatusCodes.OK).json(boards)
      }else {

        res.status(500).json({message: "no boards found"})
      }

  } catch (error) {

      res.json(error.message)
  }
}



const getAllMembersAndOwnersByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1: Find all boards created by the user (using creatorId)
    const boards = await boardModel.Board.find({
      creatorId: userId
    }).select('_id title slug description type memberIds ownerIds');

    if (!boards || boards.length === 0) {
      return res.status(404).json({ message: 'No boards found created by this user' });
    }

    // Step 2: Extract all memberIds and ownerIds from the boards
    const memberIds = new Set();
    const ownerIds = new Set();

    boards.forEach(board => {
      board.memberIds.forEach(memberId => memberIds.add(memberId.toString()));
      board.ownerIds.forEach(ownerId => ownerIds.add(ownerId.toString()));
    });

    // Convert Sets to Arrays to use in MongoDB queries
    const allMemberIds = Array.from(memberIds);
    const allOwnerIds = Array.from(ownerIds);

    // Step 3: Fetch details of all members and owners
    const members = await User.find({ _id: { $in: allMemberIds } })
      .select('fullname email profileImage');
    const owners = await User.find({ _id: { $in: allOwnerIds } })
      .select('fullname email profileImage');

    // Step 4: Map members and owners by their ID for easier lookup
    const userMap = new Map();

    // Helper function to process a user and assign them to the map if not already there
    const processUser = (user) => {
      const userIdStr = user._id.toString();
      if (!userMap.has(userIdStr)) {
        userMap.set(userIdStr, {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          profileImage: user.profileImage,
          boards: [] // Initialize empty array to store boards for this user
        });
      }
    };

    // Add all members and owners to the userMap
    members.forEach(member => processUser(member));
    owners.forEach(owner => processUser(owner));

    // Step 5: For each board, link members and owners to the board and assign roles
    boards.forEach(board => {
      // Add board to each member with role 'member'
      board.memberIds.forEach(memberId => {
        const userIdStr = memberId.toString();
        if (userMap.has(userIdStr)) {
          userMap.get(userIdStr).boards.push({
            _id: board._id,
            title: board.title,
            slug: board.slug,
            description: board.description,
            type: board.type,
            role: 'member' // Role is 'member' for memberIds
          });
        }
      });

      // Add board to each owner with role 'admin'
      board.ownerIds.forEach(ownerId => {
        const userIdStr = ownerId.toString();
        if (userMap.has(userIdStr)) {
          userMap.get(userIdStr).boards.push({
            _id: board._id,
            title: board.title,
            slug: board.slug,
            description: board.description,
            type: board.type,
            role: 'admin' // Role is 'admin' for ownerIds
          });
        }
      });
    });

    // Step 6: Convert the userMap to an array of users
    const usersList = Array.from(userMap.values());

    // Return the result with users and their associated boards and roles
    res.status(200).json({
      success: true,
      users: usersList
    });
  } catch (error) {
    console.error('Error fetching members and owners:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const updateMemberRole = async (req, res) => {
  try {
    const { member, role } = req.body;

    // Find the board by ID
    const board = await boardModel.Board.findById(req.params.id);

    if (board) {
      if (role === "admin") {
        // Check if the user is a member
        const isMember = board.memberIds.find((id) => id.equals(member._id));
        if (isMember) {
          // Remove the user from the members array
          board.memberIds = board.memberIds.filter((id) => !id.equals(member._id));
        }

        // Add the user to the owners array
        if (!board.ownerIds.includes(member._id)) {
          board.ownerIds.push(member._id);
        }

        await board.save();
        return res.status(200).json({ status: true, message: "Admin role assigned" });

      } else if (role === "member") {
        // Check if the user is an admin
        const isAdmin = board.ownerIds.find((id) => id.equals(member._id));

        if (isAdmin) {
          // Remove the user from the owners array
          board.ownerIds = board.ownerIds.filter((id) => !id.equals(member._id));
        }

        // Add the user to the members array
        if (!board.memberIds.includes(member._id)) {
          board.memberIds.push(member._id);
        }

        await board.save();
        return res.status(200).json({ status: true, message: "Member role assigned" });
      }
    } else {
      return res.status(404).json({ status: false, message: "Board not found" });
    }

  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Server Error" });
  }
};


const update = async (req, res, next) => {
  try {
    const boardId = req.params.id

    const updatedBoard = await boardService.update(boardId, req.body)

    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getDetails,
  getAllboardsDetails,
  update,
  moveCardToDifferentColumn,
  getAllMembersAndOwnersByUser,
  updateMemberRole
}
