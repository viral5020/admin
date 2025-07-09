import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { ErrorWrap } from 'dan-components';
import { useSelector } from 'react-redux';
import { useTheme, useMediaQuery } from '@mui/material';


const title = brand.name + ' - Page Not Found';
const description = brand.desc;

const NotFound = () => {
  const isLgUp = useMediaQuery(useTheme().breakpoints.up('lg'));
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const sidebarCloseCss = {
    height: '90vh',
    width: isLgUp && sidebarOpen ? '80vw' : '90vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    overflow: 'hidden',
  }

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>

      <div
        // style={sidebarOpen ? sidebarOpenCss : sidebarCloseCss}
        style={sidebarCloseCss}
      >
        <ErrorWrap title="404" desc="Oops, Page Not Found :(" />
      </div>
    </div>
  )
};

export default NotFound;
