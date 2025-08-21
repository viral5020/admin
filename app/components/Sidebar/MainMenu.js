import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Collapse from '@mui/material/Collapse';
import Chip from '@mui/material/Chip';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { openAction } from 'dan-redux/modules/ui';
import useStyles from './sidebar-jss';
import { position } from 'stylis';

const hrStyle = {
  margin: 0,
  width: "75%",
  margin: "0px 15px",
}

// eslint-disable-next-line
function MainMenu(props) {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.subMenuOpen);
  const location = useLocation();

  const handleTransition = () => {
    const { toggleDrawerOpen, loadTransition } = props;
    toggleDrawerOpen();
    loadTransition(false);
  };

  const handleOpenMenu = (key, keyParent) => {
    dispatch(openAction({ key, keyParent }));
  };

  const { dataMenu } = props;

  const getMenus = (menuArray, paddingLevel) => menuArray.map((item, index) => {
    if (item.hideInSidebar) {
      return;
    }
    if (item.child || item.linkParent) {
      return (
        <div key={index.toString()}>
          <ListItem
            button
            to={item.linkParent ? item.linkParent : '#'}
            sx={{
              marginLeft: !item.icon ? paddingLevel : 0,
              // border: '2px solid green'
            }}
            className={
              cx(
                classes.head,
                item.icon ? classes.iconed : '',
                open.indexOf(item.key) > -1 ? classes.opened : '',
              )
            }
            onClick={() => handleOpenMenu(item.key, item.keyParent)}
          >
            {item.icon && (
              <ListItemIcon className={classes.icon}>
                <i className={item.icon} />
              </ListItemIcon>
            )}
            <ListItemText classes={{ primary: classes.primary }} variant="inset" primary={item.name} sx={{
              // border: '2px solid red'
            }} />
            {!item.linkParent && (
              <span>
                {open.indexOf(item.key) > -1 ? <ExpandLess /> : <ExpandMore />}
              </span>
            )}
          </ListItem>
          {!item.linkParent && (
            <>
              <Collapse
                component="div"
                className={cx(
                  classes.nolist,
                  (item.keyParent ? classes.child : ''),
                )}
                in={open.indexOf(item.key) > -1}
                timeout="auto"
                unmountOnExit
              >
                <List className={classes.dense} component="nav">
                  {getMenus(item.child, item.level)}
                </List>
              </Collapse>
              <hr style={hrStyle} />
            </>
          )}
        </div>
      );
    }
    if (item.title) {
      return (
        <ListSubheader
          disableSticky
          key={index.toString()}
          component="div"
          className={classes.title}
        >
          {item.name}
        </ListSubheader>
      );
    }
    return (
      <ListItem
        key={index.toString()}
        button
        sx={{
          pl: paddingLevel,
          // border: '2px solid blue'
        }}
        className={cx(classes.nested, (item.link === '/app' && location.pathname !== '/app') ? 'rootPath' : '')}
        component={NavLink}
        to={item.link}
        onClick={() => handleTransition()}
      >
        <Box
          sx={{
            flex: 1,
            pl: '17px',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {item.icon && (
            <ListItemIcon className={classes.icon}>
              {/* <i className={item.icon} /> */}
              <ion-icon name={item.icon} style={{ width: '22px', height: '22px', position: 'relative', top: '4px' }}></ion-icon>
            </ListItemIcon>
          )}
          <ListItemText classes={{ primary: classes.primary }} primary={item.name}
            sx={{
              // border: '2px solid red'
            }} />
          {item.badge && (
            <Chip color="primary" label={item.badge} className={classes.badge} />
          )}
        </Box>
      </ListItem>
    );
  });
  return (
    <div>
      {getMenus(dataMenu)}
    </div>
  );
}

MainMenu.propTypes = {
  toggleDrawerOpen: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  dataMenu: PropTypes.array.isRequired,
};

export default MainMenu;
