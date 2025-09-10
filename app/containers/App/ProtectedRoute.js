import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { checkLoginAPI, fetchNotificationAPI } from '../Dashboard/API/API';

const ProtectedRoute = () => {
  const isLoggedIn = !!sessionStorage.getItem('data'); // your auth check
  const location = useLocation();
  const navigate = useNavigate();
  const [isPageShown, setIsPageShown] = useState(false);

  const flag = location.state?.flag;
  console.log('XXX flag', flag);

  if (!isLoggedIn) {
    alert('Please, login first.');
    navigate("/login", { replace: true });
    return null;
  }

  async function isProtected() {
    console.log("ASSSSSSSSSSSSCFF");

    await fetchNotificationAPI();
    console.log("await fetchNotificationAPI();");

    const response = await checkLoginAPI();
    console.log("const response = await checkLoginAPI();", response);

    if (response.status !== 'ok') {
      setIsPageShown(false);
      alert("Session expired. Please login.");
      navigate("/login", { replace: true });
    } else if (response.first_password_changed == 0) {
      setIsPageShown(false);
      alert("Please change your password first.");
      navigate("/app/pages/user-profile", {
        replace: true,
        state: { isChangePassword: true },
      });
    } else {
      setIsPageShown(true);
    }
  }

  useEffect(() => {
    if (flag) {
      // 🔹 Skip API checks if flag is set, but still allow rendering
      setIsPageShown(true);
      return;
    }
    console.log('location.pathname', location.pathname);
    isProtected();
  }, [location.pathname, flag]);

  return isPageShown ? <Outlet /> : null;
};

export default ProtectedRoute;
