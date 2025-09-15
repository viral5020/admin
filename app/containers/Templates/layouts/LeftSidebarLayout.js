import React, { Fragment, useEffect, useRef, useState } from 'react';
import { PropTypes } from 'prop-types';

import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

import {
  Header,
  Sidebar,
  BreadCrumb,
} from 'dan-components';
import { getSibarContent } from 'dan-api/ui/menu';
// import menuItems from 'dan-api/ui/menu';
import Decoration from '../Decoration';
import useStyles from '../appStyles-jss';
import { useLocation } from 'react-router-dom';

function LeftSidebarLayout(props) {
  const { classes, cx } = useStyles();
  const {
    children,
    toggleDrawer,
    sidebarOpen,
    loadTransition,
    pageLoaded,
    mode,
    gradient,
    deco,
    history,
    bgPosition,
    changeMode,
    place,
    titleException,
    handleOpenGuide
  } = props;
  const location = useLocation();

  const dt = getSibarContent();
  // console.log('dt', dt);// logs on every page changes
  const [dataMenu, setDataMenu] = useState(dt);

  const { user_id = null, auth_key = null } = location.state ?? {};
  // console.log('location.pathname', location.pathname); // it doesnt log login path

  useEffect(() => {
    if (Boolean(user_id) && Boolean(auth_key)) {
      console.log("Inside useEffect of LeftSidebarLayout.js");

      const userInterval = setInterval(() => {
        const newData = JSON.parse(sessionStorage.getItem("data"));
        const newNotificationData = JSON.parse(sessionStorage.getItem("notification"));

        if (newData && newNotificationData) {
          clearInterval(userInterval);
          const dd = getSibarContent();
          console.log('dd', dd);
          setDataMenu(dd);
        }
      }, 1000);
    }
  }, [location.pathname])


  return (
    <Fragment>
      <Header
        toggleDrawerOpen={toggleDrawer}
        margin={sidebarOpen}
        gradient={gradient}
        position="left-sidebar"
        changeMode={changeMode}
        mode={mode}
        title={place}
        history={history}
        openGuide={handleOpenGuide}
      />
      {/* {dataMenuRef &&
        <Sidebar
          open={sidebarOpen}
          toggleDrawerOpen={toggleDrawer}
          loadTransition={loadTransition}
          dataMenu={dataMenuRef.current}
          leftSidebar
        />
      } */}
      {dataMenu &&
        <Sidebar
          open={sidebarOpen}
          toggleDrawerOpen={toggleDrawer}
          loadTransition={loadTransition}
          dataMenu={dataMenu}
          leftSidebar
        />
      }

      <main className={cx(classes.content, !sidebarOpen ? classes.contentPaddingLeft : '')} id="mainContent">
        <Decoration
          mode={mode}
          gradient={gradient}
          decoration={deco}
          bgPosition={bgPosition}
          horizontalMenu={false}
        />
        <section className={cx(classes.mainWrap, classes.sidebarLayout)}>
          {/* {titleException.indexOf(history.location.pathname) < 0 && (
            <div className={classes.pageTitle}>
              <Typography component="h4" className={bgPosition === 'header' ? classes.darkTitle : classes.lightTitle} variant="h4">{place}</Typography>
              <BreadCrumb separator=" / " theme={bgPosition === 'header' ? 'dark' : 'light'} location={history.location} />
            </div>
          )} */}
          {!pageLoaded && (<img src="/images/spinner.gif" alt="spinner" className={classes.circularProgress} />)}
          <Fade
            in={pageLoaded}
            {...(pageLoaded ? { timeout: 700 } : {})}
          >
            <div className={!pageLoaded ? classes.hideApp : ''}>
              {/* Application content will load here */}
              {children}
            </div>
          </Fade>
        </section>
      </main>
    </Fragment>
  );
}

LeftSidebarLayout.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  pageLoaded: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  gradient: PropTypes.bool.isRequired,
  deco: PropTypes.bool.isRequired,
  bgPosition: PropTypes.string.isRequired,
  place: PropTypes.string.isRequired,
  titleException: PropTypes.array.isRequired,
  handleOpenGuide: PropTypes.func.isRequired
};

LeftSidebarLayout.defaultProps = {
  pageLoaded: false,
};

export default LeftSidebarLayout;
