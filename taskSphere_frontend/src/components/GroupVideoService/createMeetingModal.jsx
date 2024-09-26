import React from 'react';
import { Modal, Box } from '@mui/material';
import CreateMeetingPage from './createMeetingPage';
import ClientProvider from './clientProvider';
import Navbar from './streamComponents/Navbar';

const CreateMeetingModal = ({card, open, onClose }) => {
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
          overflow: "auto"
        }}
      >
      <ClientProvider cardId ={card._id} >

        <Navbar cardId={card._id}/>
        <CreateMeetingPage card ={card} onClose={onClose} />

      </ClientProvider>
      </Box>
    </Modal>
  );
};

export default CreateMeetingModal;
