import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  InputAdornment
} from '@mui/material';
import Lock from '@mui/icons-material/Lock';
import useStyles from './profile-jss';

const Albums = () => {
  const classes = useStyles();

  const [investorData, setInvestorData] = useState({ password: '' });
  const [investorError, setInvestorError] = useState('');

  const handleInvestorChange = (e) => {
    setInvestorData({ ...investorData, password: e.target.value });
  };

  const handleInvestorSubmit = (e) => {
    e.preventDefault();
    if (!investorData.password) {
      setInvestorError('Investor password is required.');
      return;
    }
    setInvestorError('');
    // Handle password submission logic here
    console.log('Submitted investor password:', investorData.password);
  };

  return (
    <Grid container justifyContent="center" direction="row" spacing={3}>
      <Grid item md={12}>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          Investor Password
        </Typography>
        <form
          onSubmit={handleInvestorSubmit}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            maxWidth: 700,
            margin: '40px auto',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="investorPassword"
                label="Investor Password"
                type="password"
                value={investorData.password}
                onChange={handleInvestorChange}
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

            {investorError && (
              <Grid item xs={12}>
                <Typography color="error">{investorError}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                className={classes.button}
              >
                Create Password
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default Albums;



// const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
//   return <NavLink to={props.to} {...props} />; // eslint-disable-line
// });


// function Albums() {
//   const { classes } = useStyles();

//   return (
//     <div className={classes.root}>
//       <Grid
//         container
//         direction="row"
//         spacing={3}
//       >
//         <Grid item md={6} sm={12} xs={12}>
//           <ButtonBase
//             focusRipple
//             className={classes.image}
//             focusVisibleClassName={classes.focusVisible}
//             component={LinkBtn}
//             to="/app/pages/photo-gallery"
//           >
//             <ImageList rowHeight={160} className={classes.gridList} cols={3}>
//               {imgData.map((tile, index) => {
//                 if (index > 6) {
//                   return false;
//                 }
//                 return (
//                   <ImageListItem key={index.toString()} cols={tile.cols || 1}>
//                     <img src={tile.img} className={classes.img} alt={tile.title} />
//                   </ImageListItem>
//                 );
//               })}
//             </ImageList>
//             <span className={classes.imageBackdrop} />
//             <span className={classes.imageButton}>
//               <Typography
//                 component="span"
//                 variant="subtitle1"
//                 color="inherit"
//                 className={classes.imageTitle}
//               >
//                 Album Number One
//                 <span className={classes.imageMarked} />
//               </Typography>
//             </span>
//           </ButtonBase>
//           <ButtonBase
//             focusRipple
//             className={classes.image}
//             focusVisibleClassName={classes.focusVisible}
//             component={LinkBtn}
//             to="/app/pages/photo-gallery"
//           >
//             <ImageList rowHeight={160} className={classes.gridListAlbum} cols={3}>
//               {imgData.map((tile, index) => {
//                 if (index > 2 && index < 9) {
//                   return false;
//                 }
//                 return (
//                   <ImageListItem key={index.toString()} cols={tile.cols || 1}>
//                     <img src={tile.img} className={classes.img} alt={tile.title} />
//                   </ImageListItem>
//                 );
//               })}
//             </ImageList>
//             <span className={classes.imageBackdrop} />
//             <span className={classes.imageButton}>
//               <Typography
//                 component="span"
//                 variant="subtitle1"
//                 color="inherit"
//                 className={classes.imageTitle}
//               >
//                 Album Number Three
//                 <span className={classes.imageMarked} />
//               </Typography>
//             </span>
//           </ButtonBase>
//         </Grid>
//         <Grid item md={6} sm={12} xs={12}>
//           <ButtonBase
//             focusRipple
//             className={classes.image}
//             focusVisibleClassName={classes.focusVisible}
//             component={LinkBtn}
//             to="/app/pages/photo-gallery"
//           >
//             <ImageList rowHeight={160} className={classes.gridList} cols={3}>
//               {imgData.map((tile, index) => {
//                 if (index > 4 && index < 10) {
//                   return false;
//                 }
//                 return (
//                   <ImageListItem key={index.toString()} cols={tile.cols || 1}>
//                     <img src={tile.img} className={classes.img} alt={tile.title} />
//                   </ImageListItem>
//                 );
//               })}
//             </ImageList>
//             <span className={classes.imageBackdrop} />
//             <span className={classes.imageButton}>
//               <Typography
//                 component="span"
//                 variant="subtitle1"
//                 color="inherit"
//                 className={classes.imageTitle}
//               >
//                 Album Number Two
//                 <span className={classes.imageMarked} />
//               </Typography>
//             </span>
//           </ButtonBase>
//           <ButtonBase
//             focusRipple
//             className={classes.image}
//             focusVisibleClassName={classes.focusVisible}
//             component={LinkBtn}
//             to="/app/pages/photo-gallery"
//           >
//             <ImageList rowHeight={160} className={classes.gridList} cols={3}>
//               {imgData.map((tile, index) => {
//                 if (index % 2) {
//                   return false;
//                 }
//                 return (
//                   <ImageListItem key={index.toString()} cols={tile.cols || 1}>
//                     <img src={tile.img} className={classes.img} alt={tile.title} />
//                   </ImageListItem>
//                 );
//               })}
//             </ImageList>
//             <span className={classes.imageBackdrop} />
//             <span className={classes.imageButton}>
//               <Typography
//                 component="span"
//                 variant="subtitle1"
//                 color="inherit"
//                 className={classes.imageTitle}
//               >
//                 Album Number Four
//                 <span className={classes.imageMarked} />
//               </Typography>
//             </span>
//           </ButtonBase>
//         </Grid>
//       </Grid>
//     </div>
//   );
// }