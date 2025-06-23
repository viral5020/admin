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
  const bull = <span className={classes.bullet}>•</span>;
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  // Handle text field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Clear error on input change
  };

  async function handleChnagePassword(values) {
    try {
      const response = await fetch('https://goldmineexch.org/ajaxfiles/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log('API Response:', data); // <-- Debug this

      const isLoginSuccessful = data.status === 'ok';
      console.log('isLoginSuccessful', isLoginSuccessful);

      if (isLoginSuccessful) {
        // alert('Password changed successfully!');
        navigate('/app');
      } else {
        alert('Login failed: ' + (data.message || 'Invalid credentials'));
        // window.location.href = 'http://localhost:3000/login-v2';
        navigate('/login-v2');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    const auth_key = sessionStorage.getItem('auth_key')
    const login_id = sessionStorage.getItem('login_id')
    const user_id = sessionStorage.getItem('user_id')
    const values = {
      is_app: 1,
      auth_key,
      login_user_id: user_id,
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }

    handleChnagePassword(values);

    // Log form data (placeholder for backend integration)
    console.log('Password Change Form Data:', { currentPassword, newPassword });
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
    setError(''); // Clear error
  };

  return (
    <Grid
      container
      justifyContent="center"
      direction="row"
      spacing={3}
    >
      <Grid item md={12}>
        <Typography variant="h6" component="h2" sx={{ ml: 34 }}>
          Change Password
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',       // very light white
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            maxWidth: 700,
            margin: '40px auto',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="currentPassword"
                label="Current Password"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                className={classes.button}
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