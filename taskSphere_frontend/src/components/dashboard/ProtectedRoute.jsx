import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { user} = useSelector((state) => state.user);

  if (!user || Object.keys(user).length === 0) {
    setTimeout(() => {

        return <Navigate to="/login" />;
    }, 5000)
  }else {

      return children;
  }

};

export default ProtectedRoute;
