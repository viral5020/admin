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
            <FormLabel component="legend">Theme</FormLabel>
            <RadioGroup
              value={settings.basicSettings.theme}
              onChange={handleRadioChange('basicSettings', 'theme')}
            >
              <FormControlLabel value="light" control={<Radio />} label="Light" />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            </RadioGroup>
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
      <FormControlLabel
        control={
          <Switch
            checked={settings.securitySettings.twoFA}
            onChange={handleToggle('securitySettings', 'twoFA')}
          />
        }
        label="Two-Factor Authentication"
      />
      <FormControlLabel
        control={
          <Switch
            checked={settings.securitySettings.privacyMode}
            onChange={handleToggle('securitySettings', 'privacyMode')}
          />
        }
        label="Privacy Mode"
      />
    </Stack>

    {/* Your Devices Section */}
    <Box>
      <Typography variant="h6" gutterBottom>Your Devices</Typography>
      <Stack spacing={2}>
        {deviceList.map(device => (
          <Box
            key={device.id}
            sx={{
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fafafa'
            }}
          >
            <Box>
              <Typography variant="subtitle1">{device.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {device.location} — Last active: {device.lastActive}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="button"
                color="primary"
                sx={{ cursor: 'pointer' }}
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
          <FormControlLabel
            control={
              <Switch
                checked={settings.soundSettings.autoSquareOff}
                onChange={handleToggle('soundSettings', 'autoSquareOff')}
              />
            }
            label="Auto Square Off Sound"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.soundSettings.limitClear}
                onChange={handleToggle('soundSettings', 'limitClear')}
              />
            }
            label="Limit Clear Sound"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.soundSettings.notifications}
                onChange={handleToggle('soundSettings', 'notifications')}
              />
            }
            label="Notification Sound"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.soundSettings.alerts}
                onChange={handleToggle('soundSettings', 'alerts')}
              />
            }
            label="Alert Sound"
          />
        </Stack>
      </TabPanel>

    </Box>
  );
}

export default Connection;
