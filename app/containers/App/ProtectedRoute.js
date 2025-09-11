import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { checkLoginAPI, fetchNotificationAPI } from '../Dashboard/API/API';

const ProtectedRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPageShown, setIsPageShown] = useState(false);
  const isLoggedIn = !!sessionStorage.getItem('data'); // your auth check

  const { user_id = null, auth_key = null } = location.state ?? {};
  const isJustLogin = Boolean(user_id) && Boolean(auth_key)
  console.log("AAACC");
  async function isProtected() {
    !isJustLogin ? await fetchNotificationAPI() : await fetchNotificationAPI(isJustLogin, user_id, auth_key);

    // const response = !isJustLogin ? await checkLoginAPI() : await checkLoginAPI(isJustLogin, user_id, auth_key);
    if (!isJustLogin) {
      const response = await checkLoginAPI();
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
  }

  useEffect(() => {
    // if (flag) {
    //   // 🔹 Skip API checks if flag is set, but still allow rendering
    //   setIsPageShown(true);
    //   return;
    // }
    const isLoggedIn = !!sessionStorage.getItem('data'); // your auth check

    if (!isLoggedIn) {
      alert('Please, login first.');
      navigate("/login", { replace: true });
      return;
    }
    console.log('location.pathname', location.pathname);
    isProtected();
  }, [location.pathname]);

  return isPageShown ? <Outlet /> : null;
};

export default ProtectedRoute;
