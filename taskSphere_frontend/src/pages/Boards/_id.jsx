import { useEffect} from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash'


import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
import { mapOrder } from '../../utils/sorts';
import { generatePlaceholderCard } from './../../utils/formatters';
import { fetchSingleBoard, moveCardToDifferentColumn, updateBoard } from '../../redux/reducers/boardSlice';
import { getColumns, deleteColumn, createColumn, updateColumn } from '../../redux/reducers/columnSlice';
import { createNewCard, fetchAllCards} from '../../redux/reducers/cardSlice';

function Board() {
  const dispatch = useDispatch();
  const { id: boardId } = useParams();

  const { board, loading, error} = useSelector((state) => state.board);
  const { columns, column} = useSelector((state) => state.column);
  const { card, cards} = useSelector((state) => state.card);
  
  console.log(columns)

  useEffect(() => {
    dispatch(fetchSingleBoard(boardId));
    dispatch(getColumns(boardId));

  }, [dispatch]);

  useEffect(() => {
      dispatch(fetchAllCards(boardId))

  }, [dispatch, card])




  // useEffect(() => {
  //   if (columns.length > 0) {
  //     // Sort columns by the specified order
  //     const sortedColumns = mapOrder(columns, board.columnOrderIds, '_id');
  //     sortedColumns.forEach((column) => {
  //       // Handle empty columns
  //       const columnCards = cards.filter((card) => card.columnId === column._id);
  //       if (isEmpty(columnCards)) {
          
  //         const placeholderCard = generatePlaceholderCard(column);

  //         console.log("aiki", placeholderCard)
  //         console.log(column)
  
  //         // Create a copy of the column object and update cardOrderIds
  //         const updatedColumn = {
  //           ...column,
  //           cardOrderIds: [placeholderCard._id]
  //         };
  
  //         // Now you can use updatedColumn as needed, for example, updating the Redux state
  //         dispatch(updateColumn({
  //           columnId: updatedColumn._id,
  //           data: { cardOrderIds: updatedColumn.cardOrderIds }
  //         }));
  //       } else {
  //         // Otherwise, sort cards within the column
  //         mapOrder(columnCards, column.cardOrderIds, '_id');
  //       }
  //     });
  //   }
  // }, [ cards, dispatch]);
  

  const createNewColumn = async (newColumnData) => {
    try {
     await dispatch(createColumn({ ...newColumnData, boardId })).unwrap();
      
      if(column) {

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
      toast.error('Failed to create card');
    }
  };

  const moveColumns = async (dndOrderedColumns) => {
    try {
      const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);

      await dispatch(updateBoard({
        boardId: board._id,
        data: { columnOrderIds: dndOrderedColumnsIds }
      }));

      toast.success('Columns reordered successfully');
    } catch (error) {
      toast.error('Failed to reorder columns');
    }
  };

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    try {
      // Get the current state for columns and cards from Redux
      
  
      // Create new arrays to avoid direct state mutation
      const updatedColumns = [...columns];
      const updatedCards = [...cards];
  
      // Find the column to update
      const columnToUpdate = updatedColumns.find(column => column._id === columnId);
  
      if (columnToUpdate) {
        // Update the column's cardOrderIds
        columnToUpdate.cardOrderIds = dndOrderedCardIds;
        
        // Update the cards in the column
        const updatedColumnCards = dndOrderedCards.map(card => {
          return { ...card };
        });
  
        // Update the corresponding cards in the global cards state
        updatedColumnCards.forEach(updatedCard => {
          const cardIndex = updatedCards.findIndex(card => card._id === updatedCard._id);
          if (cardIndex > -1) {
            updatedCards[cardIndex] = updatedCard;
          }
        });
      }
  
      // Dispatch an action to update the column in the column slice
       dispatch(updateColumn({
        columnId,
        data: { cardOrderIds: dndOrderedCardIds }
      }));
  
      // Dispatch an action to update the cards in the card slice
     dispatch(updateCardsInState(updatedCards)); // Assuming `updateCardsInState` is an action for updating cards
  
      // Show success notification
      toast.success('Card moved within column successfully');
    } catch (error) {
      // Show error notification
      toast.error('Failed to move card within column');
    }
  }
  

  const moveCardToDifferentColumn = async (currentCardId, prevColumnId, nextColumnId) => {
    try {
      await dispatch(moveCardToDifferentColumn({
        currentCardId,
        prevColumnId,
        nextColumnId
      }));

      toast.success('Card moved to different column successfully');
    } catch (error) {
      toast.error('Failed to move card to different column');
    }
  };

  const deleteColumnDetails = async (columnId) => {
    try {
      await dispatch(deleteColumn(columnId));
      toast.success('Column deleted successfully');
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
      <BoardBar board={board} />
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
