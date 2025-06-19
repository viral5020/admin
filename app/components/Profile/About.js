import React, { useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import LocalPhone from '@mui/icons-material/LocalPhone';
import DateRange from '@mui/icons-material/DateRange';
import LocationOn from '@mui/icons-material/LocationOn';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Check from '@mui/icons-material/Check';
import AcUnit from '@mui/icons-material/AcUnit';
import Adb from '@mui/icons-material/Adb';
import AllInclusive from '@mui/icons-material/AllInclusive';
import AssistantPhoto from '@mui/icons-material/AssistantPhoto';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Person from '@mui/icons-material/Person';
import Email from '@mui/icons-material/Email';
import Home from '@mui/icons-material/Home';
import imgData from 'dan-api/images/imgData';
import Type from 'dan-styles/Typography.scss';
// import Timeline from '../SocialMedia/Timeline';
import PapperBlock from '../PapperBlock/PapperBlock';
import useStyles from './profile-jss';

function About(props) {
  const { data } = props;
  const { classes, cx } = useStyles();
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentEmail, setOtpSentEmail] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(null);


  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; // only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name is required and should be at least 2 characters.';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone2FA || !phoneRegex.test(formData.phone2FA)) {
      newErrors.phone2FA = 'Phone number must be 10 digits.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email2FA || !emailRegex.test(formData.email2FA)) {
      newErrors.email2FA = 'Enter a valid email address.';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required.';
    }

    if (!formData.city || formData.city.trim().length < 2) {
      newErrors.city = 'City is required and should be at least 2 characters.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    phone2FA: '',
    email2FA: '',
    birthDate: '',
    city: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);

  // Handle text field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSendEmail() {
    const emailId = formData.email2FA;

    console.log('Verifying email:', emailId);
    if (isValidEmail(emailId)) {
      try {
        const response = await fetch('http://localhost:9000/send-verification-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailId: emailId }),
        });
        setOtpSentEmail(true);
      } catch (error) {
        console.log("error", error);
      }
    } else {
      setErrors(prev => ({ ...prev, email2FA: 'Enter a valid email address.' }));
      console.error('Invalid email format');
    }
  }

  async function handleVerifyEmail() {
    try {
      const reposense = await fetch('http://localhost:9000/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailId: formData.email2FA, otp: otp.join('') }),
      });
      const data = await reposense.json();
      console.log('data', data);
      data.success ? setIsEmailVerified(true) : setIsEmailVerified(false);
    } catch (error) {
      console.error('Error verifying email:', error);
      setErrors(prev => ({ ...prev, email2FA: 'Failed to verify email. Please try again.' }));
    }
  }

  const handlePhoneVerifyClick = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone2FA)) {
      setErrors(prev => ({ ...prev, phone2FA: 'Enter a valid 10-digit phone number.' }));
      return;
    }

    // Simulate sending OTP (you could call an actual backend API here)
    setOtpSent(true);
    alert(`OTP sent to ${formData.phone2FA}`);
  };


  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form is valid, submitting:", formData);
      // Proceed to submit the form
    } else {
      console.warn("Validation failed.");
    }
  };


  return (
    <Grid
      container
      alignItems="flex-start"
      justifyContent="flex-start"
      direction="row"
      spacing={3}
    >
      <Grid item md={7} xs={12}>
        <PapperBlock
          title="Update Profile"
          icon="ion-ios-create-outline"
          whiteBg
          desc="Update your profile information below."
        >
          <form onSubmit={handleSubmit} className={classes.profileList}>
            <Grid container spacing={2}>
              {/* Profile Picture Upload */}
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Avatar
                  src={profilePicture || undefined}
                  className={classes.avatar}
                  style={{ width: 80, height: 80, margin: 'auto' }}
                >
                  {!profilePicture && <Person />}
                </Avatar>
                <Button
                  variant="contained"
                  component="label"
                  color="secondary"
                  className={classes.button}
                  style={{ marginTop: 8 }}
                >
                  Upload Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleProfilePictureChange}
                  />
                </Button>
              </Grid>

              {/* Name Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </Grid>

              {/* Phone Field + Verify */}
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      name="phone2FA"
                      label="Phone"
                      value={formData.phone2FA}
                      onChange={handleInputChange}
                      error={!!errors.phone2FA}
                      helperText={errors.phone2FA}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalPhone />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      onClick={handlePhoneVerifyClick}
                      variant="contained"
                      color="secondary"
                    >
                      Verify
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* Show OTP Input Conditionally */}
              {otpSent && (
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    {[...Array(6)].map((_, index) => (
                      <Grid item key={index}>
                        <TextField
                          inputRef={(el) => (otpRefs.current[index] = el)}
                          value={otp[index] || ''}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          inputProps={{
                            maxLength: 1,
                            style: { textAlign: 'center', width: '40px' },
                          }}
                          variant="outlined"
                        />
                      </Grid>
                    ))}
                  </Grid>

                  <Button
                    style={{ marginTop: 8 }}
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      if (otp.join('') === '123456') {
                        alert('OTP verified!');
                      } else {
                        alert('Invalid OTP');
                      }
                    }}
                  >
                    Submit OTP
                  </Button>
                </Grid>
              )}


              {/* Email Field + Verify */}
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      name="email2FA"
                      label="Email"
                      value={formData.email2FA}
                      onChange={handleInputChange}
                      error={!!errors.email2FA}
                      helperText={errors.email2FA}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      onClick={handleSendEmail}
                      variant="contained"
                      color="secondary"
                    >
                      Verify
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              {otpSentEmail && (
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    {[...Array(6)].map((_, index) => (
                      <Grid item key={index}>
                        <TextField
                          inputRef={(el) => (otpRefs.current[index] = el)}
                          value={otp[index] || ''}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          inputProps={{
                            maxLength: 1,
                            style: { textAlign: 'center', width: '40px' },
                          }}
                          variant="outlined"
                        />
                      </Grid>
                    ))}
                  </Grid>

                  <Button
                    style={{ marginTop: 8 }}
                    variant="contained"
                    color="secondary"
                    onClick={handleVerifyEmail}
                  >
                    Submit OTP
                  </Button>
                </Grid>
              )}

              {/* Birth Date */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="birthDate"
                  label="Birth Date"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  error={!!errors.birthDate}
                  helperText={errors.birthDate}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRange />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* City */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={!!errors.city}
                  helperText={errors.city}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Home />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </Grid>

              {/* Save Button */}
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                >
                  Update Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        </PapperBlock>
      </Grid>

      <Grid item md={5} xs={12}>
        {/* Profile Progress */}
        {/* <div className={classes.progressRoot}>
          <Paper className={classes.styledPaper} elevation={4}>
            <Typography className={classes.title} variant="h5" component="h3">
              <span className={Type.light}>Profile Strength: </span>
              <span className={Type.bold}>Intermediate</span>
            </Typography>
            <Grid container justifyContent="center">
              <Chip
                avatar={(
                  <Avatar>
                    <Check />
                  </Avatar>
                )}
                label="60% Progress"
                className={classes.chip}
                color="primary"
              />
            </Grid>
            <LinearProgress variant="determinate" className={classes.progress} value={60} />
          </Paper>
        </div> */}
        {/* About Me */}
        {/* <PapperBlock title="About Me" icon="ion-ios-contact-outline" whiteBg noMargin desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed urna in justo euismod condimentum.">
          <Divider className={classes.divider} />
          <List dense className={classes.profileList}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <DateRange />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Born" secondary="Jan 9, 1994" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LocalPhone />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Phone" secondary="(+62)8765432190" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LocationOn />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Address" secondary="Chicendo Street no.105 Block A/5A - Barcelona, Spain" />
            </ListItem>
          </List>
        </PapperBlock> */}
        <Divider className={classes.divider} />
        {/* My Albums */}
        {/* <PapperBlock title="My Albums (6)" icon="ion-ios-images-outline" whiteBg desc="">
          <div className={classes.albumRoot}>
            <ImageList rowHeight={180} className={classes.gridList}>
              {
                imgData.map((tile, index) => {
                  if (index >= 4) {
                    return false;
                  }
                  return (
                    <ImageListItem key={index.toString()}>
                      <img src={tile.img} className={classes.img} alt={tile.title} />
                      <ImageListItemBar
                        title={tile.title}
                        subtitle={(
                          <span>
                            by: {tile.author}
                          </span>
                        )}
                        actionIcon={(
                          <IconButton className={classes.icon} size="large">
                            <InfoIcon />
                          </IconButton>
                        )}
                      />
                    </ImageListItem>
                  );
                })
              }
            </ImageList>
          </div>
          <Divider className={classes.divider} />
          <Grid container justifyContent="center">
            <Button color="secondary" className={classes.button}>
              See All
            </Button>
          </Grid>
        </PapperBlock> */}
        {/* My Connection */}
        {/* <PapperBlock title="My Connection" icon="ion-ios-contacts-outline" whiteBg desc="">
          <List dense className={classes.profileList}>
            <ListItem button>
              <Avatar className={cx(classes.avatar, classes.orangeAvatar)}>H</Avatar>
              <ListItemText primary="Harry Wells" secondary="2 Mutual Connection" />
            </ListItem>
            <ListItem button>
              <Avatar className={cx(classes.avatar, classes.purpleAvatar)}>J</Avatar>
              <ListItemText primary="John DOe" secondary="8 Mutual Connection" />
            </ListItem>
            <ListItem button>
              <Avatar className={cx(classes.avatar, classes.pinkAvatar)}>V</Avatar>
              <ListItemText primary="Victor Wanggai" secondary="12 Mutual Connection" />
            </ListItem>
            <ListItem button>
              <Avatar className={cx(classes.avatar, classes.greenAvatar)}>H</Avatar>
              <ListItemText primary="Baron Phoenix" secondary="10 Mutual Connection" />
            </ListItem>
          </List>
          <Divider className={classes.divider} />
          <Grid container justifyContent="center">
            <Button color="secondary" className={classes.button}>
              See All
            </Button>
          </Grid>
        </PapperBlock> */}
        {/* My Interests */}
        {/* <PapperBlock title="My Interests" icon="ion-ios-aperture-outline" whiteBg desc="">
          <Grid container className={classes.colList}>
            <Grid item md={6}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={cx(classes.avatar, classes.purpleAvatar)}>
                    <AcUnit />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Snow" secondary="100 Connected" />
              </ListItem>
            </Grid>
            <Grid item md={6}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={cx(classes.avatar, classes.greenAvatar)}>
                    <Adb />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Android" secondary="120 Connected" />
              </ListItem>
            </Grid>
            <Grid item md={6}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={cx(classes.avatar, classes.pinkAvatar)}>
                    <AllInclusive />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="All Inclusive" secondary="999+ Connected" />
              </ListItem>
            </Grid>
            <Grid item md={6}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={cx(classes.avatar, classes.orangeAvatar)}>
                    <AssistantPhoto />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="My Country" secondary="99+ Connected" />
              </ListItem>
            </Grid>
          </Grid>
        </PapperBlock> */}
        {/* Update Profile Form */}

      </Grid>
    </Grid>
  );
}

About.propTypes = {
  data: PropTypes.array.isRequired
};

export default About;