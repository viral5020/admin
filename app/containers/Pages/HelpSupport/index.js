import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import Grid from '@mui/material/Grid';
import Qna from './Qna';
import ContactForm from './ContactForm';

function Settings() {
  const title = brand.name;
  const description = brand.desc;
  const mdUp = useMediaQuery(theme => theme.breakpoints.up('md'));

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <Grid container spacing={2} direction={mdUp ? 'row' : 'column-reverse'}>
        <Grid item md={6} xs={12}>
          <Qna />
        </Grid>
        <Grid item md={6} xs={12}>
          <ContactForm />
        </Grid>
      </Grid>
    </div>
  );
}

export default Settings;
