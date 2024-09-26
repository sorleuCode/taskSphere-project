import React from 'react'
import ClientProvider from './clientProvider'
import { useParams } from 'react-router-dom'
import MyMeetingsPage from './meetings/MyMeetingsPage'

const MeetingsList = () => {
    const {cardId} = useParams()
  return (
    <div>
        <ClientProvider cardId={cardId}>
            <MyMeetingsPage/>
        </ClientProvider>
      
    </div>
  )
}

export default MeetingsList
