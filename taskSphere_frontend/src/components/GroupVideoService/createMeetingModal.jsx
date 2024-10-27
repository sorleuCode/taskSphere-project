import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
import CreateMeetingPage from './createMeetingPage';
import ClientProvider from './clientProvider';
import Navbar from './streamComponents/Navbar';
import { Loader2 } from "lucide-react";


const CreateMeetingModal = ({card, open, onClose }) => {
const [isConnected, setIsConnected] = useState(false)


  const handleStreamConnect = (value) => setIsConnected(value)




  // if (!isConnected) {
  //   return (
  //     
  //   )
  // }

  return (

    
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxHeight: '90vh',  
          overflowY: 'auto',  
        }}
      >
        {isConnected ? (<div className="flex items-center justify-center">
        <Loader2 className="mx-auto animate-spin" />
       </div> ): (<ClientProvider handleStreamConnect={handleStreamConnect} cardId={card._id} >
          <Navbar cardId={card._id} />
          <CreateMeetingPage card={card} onClose={onClose} />
        </ClientProvider>)}
        
      </Box>
    </Modal>
  );
};

export default CreateMeetingModal;
