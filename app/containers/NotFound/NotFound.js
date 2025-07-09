import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { ErrorWrap } from 'dan-components';
// import { useSelector, useDispatch } from 'react-redux';

const title = brand.name + ' - Page Not Found';
const description = brand.desc;

const sidebarCloseCss = {
  height: '95vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  overflow: 'hidden',
}

const NotFound = () => {
  // const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

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
