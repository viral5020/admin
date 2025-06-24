import React, { useState, useEffect } from 'react';
import {
  Tabs, Tab, Box, Grid, Typography, Switch, FormControlLabel,
  Radio, RadioGroup, FormLabel, FormControl
} from '@mui/material';
import datas from 'dan-api/apps/connectionData';
import ProfileCard from '../CardPaper/ProfileCard';
import useStyles from './profile-jss';
import { Stack } from '@mui/material';


function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box pt={2}>{children}</Box>}
    </div>
  );
}

const defaultSettings = {
  securitySettings: {
    twoFA: false,
    privacyMode: false,
  },
  soundSettings: {
    autoSquareOff: true,
    limitClear: true,
    notifications: true,
    alerts: true,
  },
  basicSettings: {
    theme: 'light',
    orderNotifications: true,
  }
};
const deviceList = [
  {
    id: 1,
    name: 'MacBook Pro',
    location: 'New York, USA',
    lastActive: '2 hours ago'
  },
  {
    id: 2,
    name: 'Pixel 7',
    location: 'San Francisco, USA',
    lastActive: 'Yesterday'
  }
];


function Connection() {
  const { classes } = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const [settings, setSettings] = useState(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleToggle = (section, key) => (event) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: event.target.checked
      }
    }));
  };

  const handleRadioChange = (section, key) => (event) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: event.target.value
      }
    }));
  };

  return (
    <Box className={classes.rootx}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Basic Setting" />
        <Tab label="Security" />
        <Tab label="Sound" />
      </Tabs>

      {/* Basic Setting */}
      <TabPanel value={tabIndex} index={0}>
        <Stack spacing={2} p={2}>
          <FormControl component="fieldset">
            {/* <FormLabel component="legend">Theme</FormLabel> */}
            {/* <RadioGroup
              value={settings.basicSettings.theme}
              onChange={handleRadioChange('basicSettings', 'theme')}
            >
              <FormControlLabel value="light" control={<Radio />} label="Light" />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            </RadioGroup> */}
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={settings.basicSettings.orderNotifications}
                onChange={handleToggle('basicSettings', 'orderNotifications')}
              />
            }
            label="Order Notifications"
          />
        </Stack>
      </TabPanel>


      {/* Security */}
      <TabPanel value={tabIndex} index={1}>
  <Stack spacing={4} p={2}>

    {/* Security Switches */}
    <Stack spacing={2}>
      {[
        { key: 'twoFA', label: 'Two-Factor Authentication' },
        { key: 'privacyMode', label: 'Privacy Mode' }
      ].map(({ key, label }) => (
        <Box
          key={key}
          sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 360, // optional max width for neatness
        }}
        >
          <Typography variant="body1">{label}</Typography>
          <Switch
            checked={settings.securitySettings[key]}
            onChange={handleToggle('securitySettings', key)}
            edge="end"
          />
        </Box>
      ))}
    </Stack>

    {/* Your Devices Section */}
    <Box>
  <Typography variant="h6" gutterBottom>Your Devices</Typography>
  <Stack spacing={1}>
    {deviceList.map(device => (
      <Box
        key={device.id}
        sx={{
          border: theme => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme => theme.palette.background.paper,
          boxShadow: theme => theme.shadows[1],
          cursor: 'default',
          '&:hover': {
            boxShadow: theme => theme.shadows[3],
          },
          fontSize: '0.9rem',
        }}
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {device.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.8rem' }}
          >
            {device.location} — Last active: {device.lastActive}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="button"
            color="primary"
            sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
            onClick={() => alert(`Signed out of ${device.name}`)}
          >
            Sign out
          </Typography>
        </Box>
      </Box>
    ))}
  </Stack>
</Box>

  </Stack>
</TabPanel>


      {/* Sound */}
      <TabPanel value={tabIndex} index={2}>
  <Stack spacing={2} p={2}>
    {[
      { key: 'autoSquareOff', label: 'Auto Square Off Sound' },
      { key: 'limitClear', label: 'Limit Clear Sound' },
      { key: 'notifications', label: 'Notification Sound' },
      { key: 'alerts', label: 'Alert Sound' },
    ].map(({ key, label }) => (
      <Box
        key={key}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 360, // optional max width for neatness
        }}
      >
        <Typography variant="body1">{label}</Typography>
        <Switch
          checked={settings.soundSettings[key]}
          onChange={handleToggle('soundSettings', key)}
          edge="end"
        />
      </Box>
    ))}
  </Stack>
</TabPanel>


    </Box>
  );
}

export default Connection;
