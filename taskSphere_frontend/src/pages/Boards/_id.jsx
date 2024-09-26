import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { cloneDeep, isEmpty } from 'lodash'
import { setReoderedCards } from '../../redux/reducers/cardSlice';
import { setReoderedColumns } from '../../redux/reducers/columnSlice';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
import { mapOrder } from '../../utils/sorts';
import { generatePlaceholderCard } from './../../utils/formatters';
import { fetchSingleBoard, moveCardToDifferentColumns, updateBoard } from '../../redux/reducers/boardSlice';
import { getColumns, deleteColumn, createColumn, updateColumn } from '../../redux/reducers/columnSlice';
import { createNewCard, fetchAllCards } from '../../redux/reducers/cardSlice';
import BoardInvitation from './BoardBar/BoardBarItems/BoardInvitation';

function Board() {
  const dispatch = useDispatch();
  const { id: boardId } = useParams();

  const { board, loading, moveCardStatus, error } = useSelector((state) => state.board);
  const { columns, column, status } = useSelector((state) => state.column);
  const { card} = useSelector((state) => state.card);
  const {user} = useSelector((state) => state.user)
  const [inviteBtnClicked, setInviteBtnClicked] = useState(false)

  const { boardsMembers} = useSelector((state) => state.board);

  // const isCreator = user._id === board._id;

  const membersOFaBoard = boardsMembers?.filter((member) => 
    member.boards.some(item => item._id === board._id)
  )

  
  

  useEffect(() => {
    dispatch(fetchSingleBoard(boardId));
  
  }, [dispatch]);

  useEffect(() => {
    dispatch(getColumns(boardId));
  }, [column])

  

  useEffect(() => {
    dispatch(fetchAllCards(boardId))

  }, [dispatch, moveCardStatus, card])
  

  const handleInviteBtn = (action) => {
    setInviteBtnClicked(action)
}





  const createNewColumn = async (newColumnData) => {
    try {
      await dispatch(createColumn({ ...newColumnData, boardId })).unwrap();

      if (column) {

        toast.success('Column created successfully');
      }
    } catch (error) {
      toast.error('Failed to create column');
    }
  };

  const createCard = async (newCardData) => {
    try {
      await dispatch(createNewCard({ ...newCardData, boardId })).unwrap();
      const createdCard = card
      const columnToUpdate = columns.find((column) => column._id === createdCard.columnId);
      if (columnToUpdate) {
        dispatch(updateColumn({
          columnId: createdCard.columnId,
          updatedData: { cardOrderIds: [...columnToUpdate.cardOrderIds, createdCard._id] }
        }));
      }

      toast.success('Card created successfully');
    } catch (error) {
      if (error)
      toast.error('Failed to create card');
    }
  };

  const moveColumns = async (dndOrderedColumns) => {
    try {
      const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);


       dispatch(setReoderedColumns(dndOrderedColumns))

       dispatch(updateBoard({
        boardId: board._id,
        updatedBoardData: { columnOrderIds: dndOrderedColumnsIds }
      }));

      toast.success('Columns reordered successfully');
    } catch (error) {
    
      toast.error('Failed to reorder columns');
    }
  };

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {

    try {

      const clonedColumns = cloneDeep(columns)


      const columnToUpdate = clonedColumns.find(column => column._id === columnId)

      if (columnToUpdate) {

        dispatch(setReoderedCards(dndOrderedCards))

        dispatch(updateColumn({ columnId, updatedData: { cardOrderIds: dndOrderedCardIds } }))
      }

      // Show success notification
      toast.success('Card moved within column successfully');
    } catch (error) {
      // Show error notification
      toast.error('Failed to move card within column');
    }
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    delete dndOrderedColumns.cards


    if (dndOrderedColumnsIds) {
      dispatch(setReoderedColumns(dndOrderedColumns))
      dispatch(updateBoard({ boardId, updatedBoardData: { columnOrderIds: dndOrderedColumnsIds } }))

      const prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds


      dispatch(moveCardToDifferentColumns({
        currentCardId,
        prevColumnId,
        prevCardOrderIds,
        nextColumnId,
        nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
      }))

    

    }




  }

  const deleteColumnDetails = async (columnId) => {
    

    try {
      await dispatch(deleteColumn(columnId));
    

    } catch (error) {
        toast.error('Failed to delete column');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh'
        }}
      >
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh'
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <BoardBar boardsMembers = {membersOFaBoard} board={board} handleInviteBtn = {handleInviteBtn} />
      {inviteBtnClicked && (<BoardInvitation handleInviteBtn ={handleInviteBtn} board={board}/>)}

      <BoardContent
        board={board}
        columns={columns}
        createNewColumn={createNewColumn}
        createNewCard={createCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  );
}

export default Board;
