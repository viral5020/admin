import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAction, playTransitionAction } from 'dan-redux/modules/ui';
import { HeaderMenu, Footer, GuideSlider } from 'dan-components';
import dataMenu from 'dan-api/ui/menuBlog';
import Decoration from './Decoration';
import useStyles from './appStyles-jss';

function Blog(props) {
  const [transform, setTransform] = useState(0);
  const [openGuide, setOpenGuide] = useState(false);

  const dispatch = useDispatch();

  const handleScroll = () => {
    const doc = document.documentElement;
    const scroll = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    setTransform(scroll);
  };

  useEffect(() => {
    const { history } = props;
    // Scroll content to top
    window.addEventListener('scroll', handleScroll);
    // Execute all arguments when page changes
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (unlisten != null) {
        unlisten();
      }
    };
  }, []);

  const handleOpenGuide = () => {
    setOpenGuide(true);
  };

  const handleCloseGuide = () => {
    setOpenGuide(false);
  };

  const { classes } = useStyles();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const mode = useSelector((state) => state.ui.type);
  const gradient = useSelector((state) => state.ui.gradient);
  const deco = useSelector((state) => state.ui.decoration);
  const layout = useSelector((state) => state.ui.layout);

  const {
    children,
    history,
    changeMode,
  } = props;
  return (
    <div className={classes.appFrameLanding} id="mainContent">
      <GuideSlider openGuide={openGuide} closeGuide={handleCloseGuide} />
      <Decoration
        mode={mode}
        gradient={gradient}
        decoration={deco}
        bgPosition="header"
        horizontalMenu={layout === 'top-navigation' || layout === 'mega-menu'}
      />
      <HeaderMenu
        type="top-navigation"
        dataMenu={dataMenu}
        fixed={transform > 64}
        changeMode={changeMode}
        mode={mode}
        history={history}
        openGuide={handleOpenGuide}
        toggleDrawerOpen={() => dispatch(toggleAction())}
        openMobileNav={sidebarOpen}
        loadTransition={() => dispatch(playTransitionAction())}
        isLogin={false}
        logoLink="/blog"
      />
      <div className={classes.blogWrap}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

Blog.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
  changeMode: PropTypes.func.isRequired,
};

export default Blog;
