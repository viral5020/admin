import React, { useState, useEffect } from 'react';
import { Fab, useTheme, Slide } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Slide
      direction="up"
      in={isVisible}
      timeout={{ enter: 200, exit: 200 }}
      mountOnEnter
      unmountOnExit
    >
      <Fab
        onClick={scrollToTop}
        aria-label="Scroll to top"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: theme.palette.mode === 'dark' ? '#1976d2' : '#42a5f5',
          color: '#fff',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#1565c0' : '#2196f3',
          },
          boxShadow: theme.shadows[6],
          transition: 'background-color 0.3s ease',
        }}
      >
        <KeyboardArrowUpIcon sx={{ fontSize: '1.7rem' }} />
      </Fab>
    </Slide>
  );
};

export default BackToTop;
