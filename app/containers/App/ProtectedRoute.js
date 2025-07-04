import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';


const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!sessionStorage.getItem('data'); // your auth check

  if (!isLoggedIn) {
    alert('Please, login first.');
    return <Navigate to="/login" replace />;
  }else{
    console.log('children', children);  // output: undefined
  }

  return <Outlet />;
};

export default ProtectedRoute;
