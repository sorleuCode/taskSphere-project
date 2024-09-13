import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from './../../../utils/formatters'
import { FaArrowLeft } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'
import ModeSelect from '../../../components/ModeSelect/ModeSelect'




const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board, boardsMembers, handleInviteBtn}) {



  
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.tasksphere.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Link to={`/dashboard`}>
            <Chip
              sx={MENU_STYLES}
              label={board?.title}
              clickable
              icon={<FaArrowLeft style={{ color: 'white', fontSize: "20px" }} />}
            />
          </Link>

        </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />



        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />

        <Button
          onClick={() => handleInviteBtn(true)}
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

        <ModeSelect />


        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          
          {boardsMembers?.map((member) => (

          <Tooltip title={member.fullname}>
            <Avatar alt="name"
              src={member.profileImage}
            />
          </Tooltip>

          ))}
          

        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
