import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Edit, VideoCall } from '@mui/icons-material'
import { Box } from '@mui/material'
import EditCard from './EditCard'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import CreateMeetingModal from '../../../../../../../components/GroupVideoService/createMeetingModal'

function Card({ card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })
  const { id } = useParams()
  const { boardsMembers } = useSelector((state) => state.board);

  const membersOFaBoard = boardsMembers?.filter((member) =>
    member.boards.some(board => board._id === id)
  )

  const completedChecklist = card?.checklist.filter((item) => item.completed === true)
  const completedChecklistLength = completedChecklist?.length

  const [isEditing, setIsEditing] = useState(false);



  const openEditCard = () => setIsEditing(true);
  const closeEditCard = () => setIsEditing(false);
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateVideoCall = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };








  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }

  const shouldShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length || !!card?.checklist?.length
  }

  const handleCardCompletion = () => {
    if (card?.checklist?.length) {
      if (card?.completed) {
        return "completed"
      } else {
        return `${completedChecklistLength}/${card?.checklist?.length}`
      }
    } else {
      return null
    }
  }

  return (
    <>

      <MuiCard

        ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          overflow: 'unset',
          display: card?.FE_PlaceholderCard ? 'none' : 'block',
          border: '1px solid transparent',
          '&:hover': {
            borderColor: (theme) => theme.palette.primary.main,
            '.action-buttons': { display: 'inline-flex' }  // Show the Edit and Video buttons on hover
          },
          position: 'relative'
        }}
      >
        {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}

        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>{card?.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={openEditCard}
                size="small"
                startIcon={<Edit />}
                className="action-buttons"
                sx={{ display: 'none' }}  // Hidden by default, shown only on hover
              />
              <Button
                onClick={handleCreateVideoCall}
                size="small"
                startIcon={<VideoCall />}
                className="action-buttons"
              // Hidden by default, shown only on hover
              />

            </Box>
            {isEditing && (
              <EditCard card={card} closeEdit={closeEditCard} members={membersOFaBoard} />
            )}
          </Box>
        </CardContent>

        {shouldShowCardActions() &&
          <CardActions sx={{ p: '0 4px 8px 4px' }}>
            {!!card?.memberIds?.length &&
              <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>
            }
            {!!card?.comments?.length &&
              <Button size="small" startIcon={<CommentIcon />}>{card?.comments?.length}</Button>
            }
            {!!card?.attachments?.length &&
              <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>
            }
            {!!card?.checklist?.length &&
              <Button size="small" startIcon={<PlaylistAddCheckIcon />}>{handleCardCompletion()}</Button>
            }
          </CardActions>
        }
      </MuiCard>



      <CreateMeetingModal card={card} open={isModalOpen} onClose={handleCloseModal} />


    </>

  )
}

export default Card
