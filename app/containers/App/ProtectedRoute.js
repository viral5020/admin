import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { checkLoginAPI, fetchNotificationAPI } from '../Dashboard/API/API';
import { useDispatch } from 'react-redux';
import { setEmp_permission, setNotificationData } from 'dan-redux/modules/authSlice';

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isPageShown, setIsPageShown] = useState(false);
  const isLoggedIn = !!sessionStorage.getItem('data'); // your auth check

  const { user_id = null, auth_key = null } = location.state ?? {};
  const isJustLogin = Boolean(user_id) && Boolean(auth_key);

  async function isProtected() {
    const notificationData = !isJustLogin ? await fetchNotificationAPI() : await fetchNotificationAPI(isJustLogin, user_id, auth_key);
    dispatch(setNotificationData(notificationData));
    sessionStorage.setItem('notification', JSON.stringify(notificationData));

    const response = !isJustLogin ? await checkLoginAPI() : await checkLoginAPI(isJustLogin, user_id, auth_key);
    dispatch(setEmp_permission(response?.emp_permission || []));

    // console.log("await checkLoginAPI()");

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
    const isLoggedIn = !!sessionStorage.getItem('data');

    if (!isLoggedIn) {
      alert('Please, login first.');
      navigate("/login", { replace: true });
      return;
    }

    isProtected();
  }, [location.pathname]);

  return isPageShown ? <Outlet /> : null;
};

export default ProtectedRoute;
