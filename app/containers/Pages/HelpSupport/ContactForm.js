import React from 'react';
import Button from '@mui/material/Button';
import { PapperBlock } from 'dan-components';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import useStyles from './helpSupport-jss';

// validation functions
const validationSchema = yup.object({
  name: yup
    .string('Enter your name')
    .required('Name is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
});

function ContactForm() {
  const { classes } = useStyles();
  const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });
  const defaultData = {
    name: '',
    email: '',
    message: ''
  };

  const formik = useFormik({
    initialValues: defaultData,
    validationSchema,
    onSubmit: async (values) => {
      await sleep(500);
      console.log(JSON.stringify(values, null, 2));
      alert(JSON.stringify(values, null, 2));
    },
  });

  const clearData = () => {
    formik.resetForm({
      values: defaultData
    });
  };

  return (
    <PapperBlock title="Contact Us" whiteBg icon="ion-ios-call-outline" desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed urna in justo euismod condimentum.">
      <form onSubmit={formik.handleSubmit}>
        <div>
          <TextField
            name="name"
            placeholder="Name"
            label="Name"
            variant="standard"
            className={classes.field}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </div>
        <div>
          <TextField
            name="email"
            placeholder="Email Field"
            label="Email"
            variant="standard"
            className={classes.field}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </div>
        <div className={classes.field}>
          <TextField
            name="message"
            className={classes.field}
            placeholder="Message"
            label="Message"
            variant="standard"
            multiline
            rows={4}
            value={formik.values.message}
            onChange={formik.handleChange}
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={formik.isSubmitting}
          >
            Submit
          </Button>
          <Button
            type="button"
            disabled={formik.isSubmitting}
            onClick={clearData}
          >
            Reset
          </Button>
        </div>
      </form>
    </PapperBlock>
  );
}

export default ContactForm;
