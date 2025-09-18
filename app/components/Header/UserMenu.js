import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ExitToApp from '@mui/icons-material/ExitToApp';
import LinkIcon from '@mui/icons-material/Link';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ButtonMui from '@mui/material/Button';

import dummy from 'dan-api/dummy/dummyContents';
import avatarApi from 'dan-api/images/avatars';
import link from 'dan-api/ui/link';
import useStyles from './header-jss';
import { Typography } from 'dan-vendor/@mui/material';
import { useDispatch } from 'react-redux';
import { setUserData } from 'dan-redux/modules/authSlice';
import { fetchProfileAPI, viewLoginMapAccountsAPI, removeMappedAccount, loginIntoMappedAccountAPI, addLoginMapAccountAPI } from '../../containers/Dashboard/API/API';

function UserMenu(props) {
  const dispatch = useDispatch();

  const { classes, cx } = useStyles();

  const [menuState, setMenuState] = useState({ anchorEl: null, openMenu: null });
  const [profileData, setProfileData] = useState();
  const [mapAccounts, setMapAccounts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(() => {
    const sess = sessionStorage.getItem('data');
    if (!sess || sess === 'null') return null;
    try { return String(JSON.parse(sess)?.user_id); } catch { return null; }
  });

  // Dialog states
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmLoginDialogOpen, setConfirmLoginDialogOpen] = useState(false);
  const [confirmRemoveDialogOpen, setConfirmRemoveDialogOpen] = useState(false);

  // Add these to your useState section
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUsername, setLinkUsername] = useState('');
  const [linkPassword, setLinkPassword] = useState('');
  const [linking, setLinking] = useState(false);


  const handleMenu = menu => event => {
    setMenuState(prev => ({
      openMenu: prev.openMenu === menu ? null : menu,
      anchorEl: event.currentTarget
    }));
  };

  const handleClose = () => setMenuState({ anchorEl: null, openMenu: null });

  const handleAccountClick = (account) => {
    if (String(account.user_id) === String(currentUserId)) return;
    setSelectedAccount(account);
    setDialogOpen(true);
  };

  // Remove flow
  const askRemove = () => { setDialogOpen(false); setConfirmRemoveDialogOpen(true); };
  const confirmRemove = async () => {
    console.log('🗑️ Removing account:', selectedAccount);

    try {
      const result = await removeMappedAccount({ user_id: selectedAccount.user_id });
      console.log('✅ Remove API result:', result);

      if (result.success) {
        // You could update UI here if needed (e.g., refresh list)
      } else {
        console.error('❌ Failed to remove account:', result.message || result);
      }
    } catch (error) {
      console.error('🚨 Error removing account:', error);
    } finally {
      setConfirmRemoveDialogOpen(false);
      setSelectedAccount(null);
    }
  };

  const cancelRemove = () => { setConfirmRemoveDialogOpen(false); setSelectedAccount(null); };

  // Login flow
  const askLogin = () => { setDialogOpen(false); setConfirmLoginDialogOpen(true); };
  const confirmLogin = async () => {
    if (!selectedAccount) return;

    try {
      // 1️⃣ Preserve mainLinkId from current session before overwriting
      const existingData = JSON.parse(sessionStorage.getItem("data") || "{}");
      const mainLinkId = existingData.mainLinkId;

      // 3️⃣ Call API
      const result = await loginIntoMappedAccountAPI({ user_id: selectedAccount.user_id });
      console.log('Login result:', result);

      // 4️⃣ Check response
      if (result.status !== 'ok') {
        alert(result.message || 'Failed to login into mapped account');
        setConfirmLoginDialogOpen(false);
        setSelectedAccount(null);
        return;
      }

      // 5️⃣ Merge back mainLinkId (or any keys you want to preserve)
      const newSessionData = { ...result, mainLinkId }; // 👈 put it back

      // 6️⃣ Replace session with merged data
      sessionStorage.setItem('data', JSON.stringify(newSessionData));
      dispatch(setUserData(data));

      console.log('Session updated:', sessionStorage.getItem('data'));

      // 7️⃣ Close dialog and reload
      setConfirmLoginDialogOpen(false);
      setSelectedAccount(null);
      setTimeout(() => window.location.reload(), 100);

    } catch (err) {
      console.error('❌ Error logging into mapped account:', err);
      alert('Error logging into mapped account.');
      setConfirmLoginDialogOpen(false);
      setSelectedAccount(null);
    }
  };



  const cancelConfirmLogin = () => { setConfirmLoginDialogOpen(false); setSelectedAccount(null); };

  async function viewUserProfile() {
    const sess = sessionStorage.getItem('data');
    const sessionData = sess && sess !== 'null' ? JSON.parse(sess) : {};
    if (sessionData?.user_id) setCurrentUserId(String(sessionData.user_id));
    try {
      const result = await fetchProfileAPI({ view_user_id: selectedUser?.id || "" });

      if (result.status === 'ok') setProfileData(result.data);
    } catch (err) { console.error('❌ Error fetching profile:', err); }
  }

  async function viewLoginMapAccounts() {
    try {
      const result = await viewLoginMapAccountsAPI();
      if (result.status === 'ok') setMapAccounts(result.data || []);
    } catch (err) { console.error('❌ Error fetching mapped accounts:', err); }
  }

  const getChipColor = (type = '') => {
    switch (type.toLowerCase()) {
      case 'master': return 'primary';
      case 'broker': return 'success';
      case 'sub-broker': return 'warning';
      default: return 'default';
    }
  };

  useEffect(() => { viewUserProfile(); viewLoginMapAccounts(); }, []);

  return (
    <div>
      {/* <IconButton
        aria-haspopup="true"
        onClick={handleMenu('notification')}
        color="inherit"
        className={cx(classes.notifIcon, props.dark ? classes.dark : classes.light)}
        size="large">
        <Badge className={classes.badge} badgeContent={4} color="secondary">
          <i className="ion-ios-notifications-outline" />
        </Badge>
      </IconButton> */}

      <Button onClick={handleMenu('user-setting')}>
        <Avatar
          alt={dummy.user.name}
          src={`${profileData?.profile_image}?${Date.now()}` || dummy.user.avatar}
        />
      </Button>

      <Menu
        id="menu-appbar"
        anchorEl={menuState.anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ style: { width: 350 } }}
        open={menuState.openMenu === 'user-setting'}
        onClose={handleClose}
      >
        {mapAccounts.length > 0 && (
          <>
            <Typography sx={{ pl: 2 }}>Switch Account</Typography>
            <div style={{
              maxHeight: mapAccounts.length > 3 ? 250 : 'auto',
              overflowY: mapAccounts.length > 3 ? 'auto' : 'visible'
            }}>
              {mapAccounts.map(account => {
                const isCurrent = String(account.user_id) === String(currentUserId);
                return (
                  <MenuItem
                    key={account.user_id}
                    onClick={() => handleAccountClick(account)}
                    selected={isCurrent}
                    disabled={isCurrent}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      whiteSpace: 'normal',
                      bgcolor: isCurrent ? 'action.selected' : null
                    }}
                  >
                    <div style={{ maxWidth: 230 }}>
                      <div style={{ fontWeight: 600 }}>
                        {account.login_id} — {account.userFullName}
                      </div>
                    </div>
                    <Chip
                      label={isCurrent ? `${account.user_type_name} • Current` : account.user_type_name}
                      color={getChipColor(account.user_type_name)}
                      size="small"
                    />
                  </MenuItem>
                );
              })}
            </div>
            <Divider />
          </>
        )}

        <MenuItem onClick={handleClose} component={Link} to={link.profile}>My Profile</MenuItem>
        <MenuItem onClick={handleClose} component={Link} to={link.calendar}>My Calendar</MenuItem>
        <MenuItem onClick={handleClose} component={Link} to={link.email}>My Inbox</MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose();
            setLinkDialogOpen(true);
          }}
        >
          <ListItemIcon><LinkIcon /></ListItemIcon>
          Link Account
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            sessionStorage.removeItem('data');
            sessionStorage.removeItem('notification');
            window.location.replace("/login");
          }}
          component={Link}
        // to="http://localhost:3000/login"
        >
          <ListItemIcon><ExitToApp /></ListItemIcon>
          Log Out
        </MenuItem>
      </Menu>

      {/* Account action dialog */}
      {/* Account action dialog */}
      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setSelectedAccount(null); }}>
        <DialogTitle>Account Options</DialogTitle>
        <DialogContent>
          <DialogContentText>
            What would you like to do with account <b>{selectedAccount?.userFullName}</b> ({selectedAccount?.login_id})?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {(() => {
            // 🔹 Safely get session data
            const sessionData = JSON.parse(sessionStorage.getItem('data') || '{}');
            const mainLinkId = sessionData?.mainLinkId || sessionData?.user_id; // fallback if no mainLinkId
            const isOriginalMainAccount = String(selectedAccount?.user_id) === String(mainLinkId);

            return (
              <>
                {!isOriginalMainAccount && (
                  <ButtonMui onClick={askRemove} color="error">Remove</ButtonMui>
                )}
                <ButtonMui onClick={askLogin} color="primary">Login</ButtonMui>
                <ButtonMui onClick={() => { setDialogOpen(false); setSelectedAccount(null); }}>Cancel</ButtonMui>
              </>
            );
          })()}
        </DialogActions>
      </Dialog>



      {/* Login confirmation dialog */}
      <Dialog open={confirmLoginDialogOpen} onClose={cancelConfirmLogin}>
        <DialogTitle>Confirm Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to login as <b>{selectedAccount?.userFullName}</b> ({selectedAccount?.login_id})?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonMui onClick={confirmLogin} color="primary">Yes, Login</ButtonMui>
          <ButtonMui onClick={cancelConfirmLogin}>Cancel</ButtonMui>
        </DialogActions>
      </Dialog>

      {/* Remove confirmation dialog */}
      <Dialog open={confirmRemoveDialogOpen} onClose={cancelRemove}>
        <DialogTitle>Confirm Remove</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove the account <b>{selectedAccount?.userFullName}</b> ({selectedAccount?.login_id}) from your mapped accounts?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonMui onClick={confirmRemove} color="error">Yes, Remove</ButtonMui>
          <ButtonMui onClick={cancelRemove}>Cancel</ButtonMui>
        </DialogActions>
      </Dialog>
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
        <DialogTitle>Link New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the username and password of the account you want to link.
          </DialogContentText>
          <input
            type="text"
            placeholder="Username"
            value={linkUsername}
            onChange={e => setLinkUsername(e.target.value)}
            style={{ width: '100%', marginTop: 10, padding: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={linkPassword}
            onChange={e => setLinkPassword(e.target.value)}
            style={{ width: '100%', marginTop: 10, padding: 8 }}
          />
        </DialogContent>
        <DialogActions>
          <ButtonMui
            onClick={async () => {
              if (!linkUsername || !linkPassword) {
                alert('Please enter both username and password');
                return;
              }
              setLinking(true);
              try {
                const result = await addLoginMapAccountAPI({ username: linkUsername, password: linkPassword });
                console.log('🔗 Add Login Map Account Result:', result);
                if (result.status === 'ok') {
                  // alert('Account linked successfully!');
                  setLinkDialogOpen(false);
                  setLinkUsername('');
                  setLinkPassword('');
                  viewLoginMapAccounts(); // refresh mapped accounts list
                } else {
                  // alert(result.message || 'Failed to link account');
                }
              } catch (err) {
                console.error('🚨 Error linking account:', err);
                // alert('Error linking account');
              } finally {
                setLinking(false);
              }
            }}
            color="primary"
            disabled={linking}
          >
            {linking ? 'Linking...' : 'Link Account'}
          </ButtonMui>
          <ButtonMui onClick={() => setLinkDialogOpen(false)}>Cancel</ButtonMui>
        </DialogActions>
      </Dialog>

    </div>
  );
}

UserMenu.propTypes = { dark: PropTypes.bool };
UserMenu.defaultProps = { dark: false };

export default UserMenu;
