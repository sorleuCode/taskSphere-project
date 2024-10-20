import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import UploadProfilePic from './uploadProfile/UploadProfilePic'
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from '../../../redux/reducers/userSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


function Profiles() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const { user, loading, message } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleProfile = () => {
    setUploadOpen(true)
  }


  const handleLogout = async () => {
    console.log("Logging out...");
    dispatch(logoutUser());
  };
  
  useEffect(() => {
    console.log("Logout useEffect triggered, message:", message);
    if (loading) return;
  
    if (message) {
      toast.success("Logged out successfully");
      navigate("/login");
    }
  }, [message, loading, navigate]);



  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt="profile pic"
            src={user?.profileImage ? user?.profileImage : null}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}
      >
        {!uploadOpen ? <MenuItem onClick={handleProfile}>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }} /> Profile
        </MenuItem> : <UploadProfilePic handleClose={handleClose} />}

        <MenuItem>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }} /> My account
        </MenuItem>
        <Divider />

        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles
