// import { Navigate, Outlet } from 'react-router-dom';
// import React from 'react';


// const ProtectedRoute = ({ children }) => {
//   const isLoggedIn = !!sessionStorage.getItem('data'); // your auth check

//   if (!isLoggedIn) {
//     alert('Please, login first.');
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;

import { Navigate, Outlet } from 'react-router-dom';
import React, { useEffect } from 'react';
import { checkLoginAPI, fetchNotificationAPI } from '../Dashboard/API/API';


const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!sessionStorage.getItem('data'); // your auth check

  async function isProtected() {
    if (!isLoggedIn) {
      alert('Please, login first.');
      return <Navigate to="/login" replace />;
    }

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
    isProtected();
  }, [])

  return <Outlet />;
};

export default ProtectedRoute;
