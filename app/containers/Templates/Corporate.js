import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { HeaderLanding, Footer } from 'dan-components';
import useStyles from './appStyles-jss';

function Corporate() {
  const [transform, setTransform] = useState(0);

  const handleScroll = () => {
    const scroll = window.pageYOffset;
    setTransform(scroll);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { classes } = useStyles();
  return (
    <div className={classes.appFrameLanding} id="mainContent">
      <HeaderLanding turnDarker={transform > 30} />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Corporate;
