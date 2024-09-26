import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({cardId}) {
    const {user} = useSelector((state) => state.user)
    const navigate = useNavigate()

  return (
    <header className="shadow">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-end p-3 font-medium">
        {user ? (
          <div className="flex items-center justify-end gap-5">
            <Link to={`/board/card/${cardId}/meetings`}>Meetings</Link>
          </div>
        ) : (
          <button onClick={() => navigate("/login")}>Sign In</button> // Mock Sign-In button
        )}
      </div>
    </header>
  );
}
