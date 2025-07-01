import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import Info from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useStyles from './jss/cover-jss';

const optionsOpt = [
  'Edit Profile',
  'Change Cover',
  'Option 1',
  'Option 2',
  'Option 3',
];

const ITEM_HEIGHT = 48;

function Cover(props) {
  const [anchorElOpt, setAnchorElOpt] = useState(null);
  const [profileData, setProfileData] = useState({});
  const { classes } = useStyles();
  const {
    avatar,
    name,
    desc,
    coverImg,
  } = props;

  const handleClickOpt = event => {
    setAnchorElOpt(event.currentTarget);
  };

  const handleCloseOpt = () => {
    setAnchorElOpt(null);
  };

  async function viewUserProfile() {
    const data = JSON.parse(sessionStorage.getItem('data'));
    const formData = {
      is_app: 1,
      login_user_id: data.user_id,
      auth_key: data.auth_key
    };

    try {
      const response = await fetch('http://128.199.126.171/~goldorg/ajaxfiles/view_user_profile', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status !== 'ok') {
        throw new Error(result.message || 'Failed to fetch profile');
      }

      console.log('✅ User Profile:', result.data);
      setProfileData(result.data);
      return result.data;

    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      throw error;
    }
  }


  useEffect(() => {
    viewUserProfile();
  }, []);

  return (
    <div className={classes.cover} style={{ backgroundImage: `url(${coverImg})`, height: '380px', }}>
      <div className={classes.opt}>
        <IconButton className={classes.button} aria-label="Delete" size="large">
          <Info />
        </IconButton>
        <IconButton
          aria-label="More"
          aria-owns={anchorElOpt ? 'long-menu' : null}
          aria-haspopup="true"
          className={classes.button}
          onClick={handleClickOpt}
          size="large">
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorElOpt}
          open={Boolean(anchorElOpt)}
          onClose={handleCloseOpt}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200,
            },
          }}
        >
          {optionsOpt.map(option => (
            <MenuItem key={option} selected={option === 'Edit Profile'} onClick={handleCloseOpt}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <div className={classes.content}>
        <Avatar alt={name} src={`${profileData?.profile_image}?${Date.now()}` || avatar} className={classes.avatar} style={{ width: 90, height: 90 }} />
        <Typography variant="h6" className={classes.name} gutterBottom>
          {profileData.user_name}
          <VerifiedUser className={classes.verified} />
        </Typography>
        {/* <Typography className={classes.subheading} gutterBottom>
          {desc}
        </Typography> */}
        <Button className={classes.button} size="large" variant="contained" color="secondary">
          Add to Connection
        </Button>
      </div>
    </div>
  );
}

Cover.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  coverImg: PropTypes.string.isRequired,
};

export default Cover;
