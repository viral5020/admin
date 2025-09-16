import React, { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Lock from '@mui/icons-material/Lock';
import imgApi from 'dan-api/images/photos';
import avatarApi from 'dan-api/images/avatars';
import GeneralCard from '../CardPaper/GeneralCard';
import PostCard from '../CardPaper/PostCard';
import Quote from '../Quote/Quote';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// import { changePasswordApi } from 'app/containers/Dashboard/API/API.js'
import { changePasswordApi } from '../../containers/Dashboard/API/API'


const types = {
  // userType: api for change password
  default: 'ajaxfiles/change_password',
  emp: 'ajaxfiles/change_emp_password',
}

const useStyles = makeStyles()((theme) => ({
  divider: {
    margin: `${theme.spacing(2)} 0`,
    background: 'none'
  },
  form: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

function Favorites() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const userData = JSON.parse(sessionStorage.getItem('data'));

  const api = userData?.isEmployeeLogin ? types.emp : types.default;

  // Form state
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  // Handle field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      const response = await changePasswordApi(api, currentPassword, newPassword, confirmPassword);

      console.log('API Response:', response);

      if (response.status === 'ok') {
        alert(response.message);
        navigate('/app');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setError('');
      } else if (response.message === 'Current Password is wrong.') {
        alert('Change failed: ' + (response.message));
        navigate('/login');
      } else if (response.message === 'Session Expired') {
        alert('Change failed: ' + (response.message) + '. Please login again.');
      } else {
        alert('Change failed: ' + (response.message || 'Invalid credentials'));
      }

    } catch (error) {
      console.error('Change error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <form
          onSubmit={handleSubmit}
          className={classes.form}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '12px',
            padding: isMobile ? '16px' : '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
            width: '100%',
            maxWidth: isMobile ? '100%' : '600px',
            margin: '16px auto',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxSizing: 'border-box',
          }}
        >
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="currentPassword"
                label="Current Password"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock style={{ color: '#757575' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock style={{ color: '#757575' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock style={{ color: '#757575' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography variant="caption" color="error">
                  {error}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12} style={{ textAlign: 'center', marginTop: 8 }}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="medium"
                className={classes.button}
                style={{
                  padding: '6px 20px',
                  fontSize: 14,
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  textTransform: 'none',
                }}
              >
                Update Password
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
      {/* <Grid item md={6}>
        <PostCard
          liked={1}
          shared={20}
          commented={15}
          date="Sept, 25 2018"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed urna in justo euismod condimentum."
          image={imgApi[5]}
          avatar={avatarApi[6]}
          name="John Doe"
        />
        <Divider className={classes.divider} />
        <GeneralCard liked={1} shared={20} commented={15}>
          <Typography className={classes.title} color="textSecondary">
            Word of the Day
          </Typography>
          <Typography variant="h5" component="h2">
            be
            {bull}
            nev
            {bull}
            o
            {bull}
            lent
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            adjective
          </Typography>
          <Typography component="p">
            well meaning and kindly.
            <br />
            ''a benevolent smile''
          </Typography>
        </GeneralCard>
        <Divider className={classes.divider} />
        <PostCard
          liked={1}
          shared={20}
          commented={15}
          date="Sept, 25 2018"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed urna in justo euismod condimentum."
          image={imgApi[16]}
          avatar={avatarApi[6]}
          name="John Doe"
        />
        <Divider className={classes.divider} />
        <PostCard
          liked={90}
          shared={10}
          commented={22}
          date="Sept, 15 2018"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed urna in justo euismod condimentum."
          avatar={avatarApi[5]}
          name="Jane Doe"
        />
        <Divider className={classes.divider} />
      </Grid> */}
      {/* <Grid item md={6}>
        <PostCard
          liked={90}
          shared={10}
          commented={22}
          date="Sept, 15 2018"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed urna in justo euismod condimentum."
          avatar={avatarApi[4]}
          name="Jane Doe"
        />
        <Divider className={classes.divider} />
        <PostCard
          liked={1}
          shared={20}
          commented={15}
          date="Sept, 25 2018"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed urna in justo euismod condimentum."
          image={imgApi[20]}
          avatar={avatarApi[6]}
          name="John Doe"
        />
        <Divider className={classes.divider} />
        <GeneralCard liked={1} shared={20} commented={15}>
          <Quote align="left" content="Imagine all the people living life in peace. You may say I'm a dreamer, but I'm not the only one. I hope someday you'll join us, and the world will be as one." footnote="John Lennon" />
        </GeneralCard>
        <Divider className={classes.divider} />
        <PostCard
          liked={90}
          shared={10}
          commented={22}
          date="Sept, 15 2018"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed urna in justo euismod condimentum."
          avatar={avatarApi[1]}
          name="Jane Doe"
        />
      </Grid> */}
    </Grid>
  );
}

export default Favorites;