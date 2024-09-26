import React from 'react'
import ClientProvider from './clientProvider'
import MeetingPage from './meetings/MeetingPage'
import { useParams } from "react-router-dom";


const VideoMeetingPage = () => {

  const {cardId} = useParams()
  return (
    <ClientProvider cardId={cardId} >
        <MeetingPage/>
    </ClientProvider>
    
  )
}

export default VideoMeetingPage
