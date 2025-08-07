import { Navigate, Outlet, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { checkLoginAPI, fetchNotificationAPI } from '../Dashboard/API/API';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!sessionStorage.getItem('data'); // your auth check
  const location = useLocation(); // track path changes

  if (!isLoggedIn) {
    alert('Please, login first.');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute entered');
  async function isProtected() {
    console.log("ProtectedRoute  function run");

    await fetchNotificationAPI();  // chatgpt : this work
    const isAuthorized = await checkLoginAPI();  // chatgpt : give cors error
    // console.log('isAuthorized', isAuthorized); // isAuthorized undefined
    // if (!isAuthorized) {
    //   console.log("Session expired. Please loginAAAAAAAAAAAAAA");
    //   alert("Session expired. Please login.");
    //   window.location.href = '/login';
    //   return;
    // } else {
    //   console.log("Pass.......");
    // }
  }

  useEffect(() => {
    isProtected();  // chagpt : does this run on every time when path
  }, [location.pathname])

  return <Outlet />;
};

export default ProtectedRoute;
