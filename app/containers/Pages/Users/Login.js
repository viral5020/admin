import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
// import { LoginForm } from 'dan-components';
import useStyles from 'dan-components/Forms/user-jss';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LoginForm } from 'dan-components';

function Login() {
  const title = brand.name + ' - Login Version 2';
  const description = brand.desc;
  const { classes } = useStyles();
  const mdDown = useMediaQuery(theme => theme.breakpoints.down('md'));

  return (
    <div className={classes.rootFull}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <div className={classes.containerSide}>
        {!mdDown && (
          <div className={classes.opening}>
            <Typography variant="h3" component="h1" className={classes.opening} gutterBottom>
              Welcome to&nbsp;
              {brand.name}
            </Typography>
            <Typography variant="h6" component="p" className={classes.subpening}>Please sign in to continue</Typography>
          </div>
        )}
        <div className={classes.sideFormWrap}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
