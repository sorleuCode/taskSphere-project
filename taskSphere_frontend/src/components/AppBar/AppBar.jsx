import { useState } from 'react'
import Box from '@mui/material/Box'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Profiles from './Menus/Profiles'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { grey } from '@mui/material/colors';


function AppBar() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.tasksphere.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: grey[50]
    }}>
      

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: "flex-end"}}>
  
        

        

        <Profiles />

      </Box>
    </Box>
  )
}

export default AppBar
