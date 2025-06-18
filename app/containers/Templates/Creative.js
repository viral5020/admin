import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { HeaderLanding } from 'dan-components';
import useMediaQuery from '@mui/material/useMediaQuery';
import useStyles from './appStyles-jss';

function Parallax(props) {
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

  const { classes, cx } = useStyles();
  const lgOnly = useMediaQuery(theme => theme.breakpoints.only('lg'));

  const { gradient } = props;

  return (
    <div className={cx(classes.appFrameSlider, gradient ? classes.gradientBg : classes.solidBg)}>
      {!lgOnly && (
        <HeaderLanding turnDarker={transform > 30} />
      )}
      <Outlet />
    </div>
  );
}

Parallax.propTypes = {
  gradient: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  gradient: state.ui.gradient
});

const ParallaxMaped = connect(
  mapStateToProps,
)(Parallax);

export default ParallaxMaped;
