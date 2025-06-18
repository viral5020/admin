import React from 'react';
import { PropTypes } from 'prop-types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Corporate from '../Templates/Corporate';
import Outer from '../Templates/Outer';
import Creative from '../Templates/Creative';
import Application from './Application';
import ArticleNews from './ArticleNews';
import ThemeWrapper from './ThemeWrapper';
import {
  HomePage, SliderPage,
  Login, LoginV2, LoginV3,
  Register, RegisterV2, RegisterV3,
  ResetPassword, LockScreen,
  ComingSoon, Maintenance,
  NotFoundDedicated
} from '../pageListAsync';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

function App(props) {
  const { history } = props;
  return (
    <ThemeWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Corporate />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="app/*" element={<Application history={history} />} />
          <Route element={<Outer />}>
            <Route path="login" element={<Login />} />
            <Route path="login-v2" element={<LoginV2 />} />
            <Route path="login-v3" element={<LoginV3 />} />
            <Route path="register" element={<Register />} />
            <Route path="register-v2" element={<RegisterV2 />} />
            <Route path="register-v3" element={<RegisterV3 />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="lock-screen" element={<LockScreen />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="coming-soon" element={<ComingSoon />} />
          </Route>
          <Route element={<Creative />}>
            <Route path="landing-creative" element={<SliderPage />} />
          </Route>
          <Route path="blog/*" element={<ArticleNews history={history} />} />
          <Route path="*" element={<NotFoundDedicated />} />
        </Routes>
      </BrowserRouter>
    </ThemeWrapper>
  );
}

App.propTypes = {
  history: PropTypes.object.isRequired,
};

export default App;
