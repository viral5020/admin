import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import brand from 'dan-api/dummy/brand';
import AppBar from '@mui/material/AppBar';
import dummy from 'dan-api/dummy/dummyContents';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SupervisorAccount from '@mui/icons-material/SupervisorAccount';
import Favorite from '@mui/icons-material/Favorite';
import PhotoLibrary from '@mui/icons-material/PhotoLibrary';
import {
  Cover,
  About,
  Connection,
  Favorites,
  Albums
} from 'dan-components';
import bgCover from 'dan-images/petal_bg.svg';
import useStyles from 'dan-components/SocialMedia/jss/cover-jss';
import data from '../../SampleApps/Timeline/api/timelineData';
import { fetchData } from '../../SampleApps/Timeline/reducers/timelineSlice';

function TabContainer(props) {
  const { children } = props;
  return (
    <div style={{ paddingTop: 8 * 3 }}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

function UserProfile() {
  const title = brand.name + ' - Profile';
  const description = brand.desc;

  const { classes } = useStyles();
  const [value, setValue] = useState(0);

  const mdUp = useMediaQuery(theme => theme.breakpoints.up('md'));
  const mdDown = useMediaQuery(theme => theme.breakpoints.down('md'));

  const dataProps = useSelector(state => state.socmed.dataTimeline);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData(data));
  }, []);

  const handleChange = (event, val) => {
    setValue(val);
  };

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
      <Cover
        coverImg={bgCover}
        avatar={dummy.user.avatar}
        name={dummy.user.name}
        desc="Consectetur adipiscing elit."
      />
      <AppBar position="static" className={classes.profileTab}>
        {!mdUp && (
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab icon={<AccountCircle />} />
            <Tab icon={<SupervisorAccount />} />
            <Tab icon={<Favorite />} />
            <Tab icon={<PhotoLibrary />} />
          </Tabs>
        )}
        {!mdDown && (
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab icon={<AccountCircle />} label="ABOUT" />
            <Tab icon={<SupervisorAccount />} label="20 CONNECTIONS" />
            <Tab icon={<Favorite />} label="18 FAVORITES" />
            <Tab icon={<PhotoLibrary />} label="4 ALBUMS" />
          </Tabs>
        )}
      </AppBar>
      {value === 0 && <TabContainer><About data={dataProps} /></TabContainer>}
      {value === 1 && <TabContainer><Connection /></TabContainer>}
      {value === 2 && <TabContainer><Favorites /></TabContainer>}
      {value === 3 && <TabContainer><Albums /></TabContainer>}
    </div>
  );
}

export default UserProfile;
