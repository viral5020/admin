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
  const [profilePic, setProfilePic] = useState();
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
    const formData = {
      is_app: 1,
      login_user_id: sessionStorage.getItem("user_id"),
      auth_key: sessionStorage.getItem("auth_key")
    };

    try {
      const response = await fetch('https://goldmineexch.org/ajaxfiles/view_user_profile', {
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

  const fetchImageAsBase64 = async () => {
    try {
      const response = await fetch('https://goldmineexch.org/assets/profile/111111.jpg');
      // if (!response.ok) throw new Error('Network response was not ok');

      console.log("after image api...")
      const blob = await response.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      // let fixed = base64.replace(/^dataimage\/(.*)base64/, 'data:image/$1;base64');
      // console.log('fixed', fixed);
      console.log('fixed', base64);
      setProfilePic(base64);
      console.log('Base64 image:', base64); // contains data:image/jpeg;base64,...
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  useEffect(() => {
    if (profileData?.profile_image) {
      fetchImageAsBase64();
    }
  }, [profileData])

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
        <Avatar alt={name} src={profilePic || avatar} className={classes.avatar} style={{ width: 90, height: 90 }} />
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
