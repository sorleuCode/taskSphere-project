
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
import { boardModel } from '~/models/boardModel'


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


const getAllMembersByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all boards created by the specific user and populate the 'members' field
    const boards = await boardModel.Board.find({ creatorId: userId }).populate('memberIds', 'fullname email');

    if (!boards || boards.length === 0) {
      return res.status(404).json({ message: 'No boards found for this user' });
    }

    // Map to track unique members and the boards they belong to
    const membersMap = new Map();

    // Iterate over each board to collect members and the board titles
    boards.forEach(board => {
      board.memberIds.forEach(member => {
        const memberId = member._id.toString();

        // If the member already exists in the map, just add the board object to their list of boards
        if (membersMap.has(memberId)) {
          membersMap.get(memberId).boards.push({
            _id: board._id,
            title: board.title,
            slug: board.slug,
            description: board.description,
            type: board.type
          });
        } else {
          // If the member is not yet in the map, add them with their details and the current board object
          membersMap.set(memberId, {
            _id: member._id,
            fullname: member.fullname,
            email: member.email,
            boards: [{
              _id: board._id,
              title: board.title,
              slug: board.slug,
              description: board.description,
              type: board.type
            }] // Start with the current board object
          });
        }
      });
    });

    // Convert the Map to an array of members with their associated boards
    const membersList = Array.from(membersMap.values());

    // Return the result with members and their associated boards
    res.status(200).json({
      success: true,
      members: membersList
    });
  } catch (error) {
    console.error('Error fetching members and board titles:', error);
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
  getAllMembersByUser,
  updateMemberRole
}
