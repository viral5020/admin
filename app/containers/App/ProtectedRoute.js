import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { checkLoginAPI, fetchNotificationAPI } from '../Dashboard/API/API';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!sessionStorage.getItem('data'); // your auth check
  const location = useLocation(); // track path changes
  const navigate = useNavigate();
  const [isPageShown, setIsPageShown] = useState(false)

  if (!isLoggedIn) {
    // setIsPageShown(false);
    alert('Please, login first.');
    navigate("/login", { replace: true });
    return;
  }

  async function isProtected() {
    console.log("ASSSSSSSSSSSSCFF")
    // const userData = JSON.parse(sessionStorage.getItem("data"));

    await fetchNotificationAPI();

    const response = await checkLoginAPI();

    if (response.status !== 'ok') {
      setIsPageShown(false);
      alert("Session expired. Please login.");
      navigate("/login", { replace: true });
      return;
    } else if (response.first_password_changed == 0) {
      setIsPageShown(false);
      alert("Please change your password first.");
      navigate("/app/pages/user-profile", { replace: true, state: { isChangePassword: true }, });
      return;
    } else {
      setIsPageShown(true);
    }
  }

  useEffect(() => {
    isProtected();  // chagpt : does this run on every time when path
  }, [location.pathname])

  return isPageShown && <Outlet />;
};

export default ProtectedRoute;
