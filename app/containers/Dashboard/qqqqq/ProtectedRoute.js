import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { checkLoginAPI, fetchNotificationAPI } from '../Dashboard/API/API';

const ProtectedRoute = () => {
  const isLoggedIn = !!sessionStorage.getItem('data'); // your auth check
  const location = useLocation();
  const navigate = useNavigate();
  const [isPageShown, setIsPageShown] = useState(false);

  console.log('location.state.user_id', location.state?.user_id);
  console.log('location.state.auth_key', location.state?.auth_key);
  const { user_id = null, auth_key = null } = location.state ?? {};
  const isJustLogin = Boolean(user_id) && Boolean(auth_key)

  if (!isLoggedIn) {
    alert('Please, login first.');
    navigate("/login", { replace: true });
    return null;
  }

  async function isProtected() {
    console.log("ync function isProtected() {");
    isJustLogin ? await fetchNotificationAPI() : await fetchNotificationAPI(isJustLogin, user_id, auth_key);

    let response;
    if (isJustLogin) {
      response = await checkLoginAPI(); // no args
    } else {
      response = await checkLoginAPI(isJustLogin, user_id, auth_key); // args
    }


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
    // if (flag) {
    //   // 🔹 Skip API checks if flag is set, but still allow rendering
    //   setIsPageShown(true);
    //   return;
    // }
    console.log('location.pathname', location.pathname);
    isProtected();
  }, [location.pathname]);

  return isPageShown ? <Outlet /> : null;
};

export default ProtectedRoute;
