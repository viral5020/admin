import React, { useState, useEffect } from 'react';
import { Fab, useTheme } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  // Show button when user scrolls down 100px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top when button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
     {isVisible && (
        <Fab
          onClick={scrollToTop}
          aria-label="Scroll to top"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            backgroundColor: theme.palette.mode === 'dark' ? '#1976d2' : '#42a5f5', // Dark: darker blue, Light: lighter blue
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#ffffff', // White icon for both modes
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1565c0' : '#2196f3', // Slightly darker on hover
            },
            boxShadow: theme.shadows[6],
            transition: 'background-color 0.3s ease',
          }}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: '2rem' }} /> {/* Increased icon size */}
        </Fab>
      )}
    </>
  );
};

export default BackToTop;