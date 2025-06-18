import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Dropzone from 'react-dropzone';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Type from 'dan-styles/Typography.scss';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import PermContactCalendar from '@mui/icons-material/PermContactCalendar';
import Bookmark from '@mui/icons-material/Bookmark';
import LocalPhone from '@mui/icons-material/LocalPhone';
import Email from '@mui/icons-material/Email';
import Smartphone from '@mui/icons-material/Smartphone';
import LocationOn from '@mui/icons-material/LocationOn';
import Work from '@mui/icons-material/Work';
import Language from '@mui/icons-material/Language';
import TextField from '@mui/material/TextField';
import css from 'dan-styles/Form.scss';
import useStyles from './contact-jss';

const validationSchema = yup.object({
  name: yup
    .string('this field is required')
    .required('this field is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
});

function AddContactForm(props) {
  const saveRef = useRef(null);

  const { classes } = useStyles();
  const {
    onDrop, sendValues,
    imgAvatar, initialValues
  } = props;
  let dropzoneRef;
  const acceptedFiles = ['image/jpeg', 'image/png', 'image/bmp'];
  const fileSizeLimit = 300000;

  const imgPreview = img => {
    if (typeof img !== 'string' && img !== '') {
      return URL.createObjectURL(imgAvatar);
    }
    return img;
  };

  const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      await sleep(500);
      sendValues(values);
    },
  });

  const reset = () => {
    formik.resetForm({
      values: initialValues
    });
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <section className={css.bodyForm}>
          <div>
            <Typography display="block" variant="button" className={Type.textCenter}>Upload Avatar</Typography>
            <Dropzone
              className={classes.hiddenDropzone}
              accept={acceptedFiles.join(',')}
              acceptClassName="stripes"
              onDrop={onDrop}
              maxSize={fileSizeLimit}
              ref={(node) => { dropzoneRef = node; }}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                </div>
              )}
            </Dropzone>
            <div className={classes.avatarWrap}>
              <Avatar
                alt="John Doe"
                className={classes.uploadAvatar}
                src={imgPreview(imgAvatar)}
              />
              <Tooltip id="tooltip-upload" title="Upload Photo">
                <IconButton
                  className={classes.buttonUpload}
                  component="button"
                  onClick={() => {
                    dropzoneRef.open();
                  }}
                  size="large">
                  <PhotoCamera />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div>
            <TextField
              id="name"
              name="name"
              variant="standard"
              placeholder="Name"
              label="Name"
              value={formik.values.name}
              ref={saveRef}
              className={classes.field}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              onChange={formik.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PermContactCalendar />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="title"
              name="title"
              variant="standard"
              placeholder="Title"
              label="Title"
              value={formik.values.title}
              className={classes.field}
              onChange={formik.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Bookmark />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="phone"
              name="phone"
              variant="standard"
              placeholder="Phone"
              type="tel"
              label="Phone"
              value={formik.values.phone}
              className={classes.field}
              onChange={formik.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalPhone />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="secondaryPhone"
              name="secondaryPhone"
              variant="standard"
              placeholder="Secondary Phone"
              type="tel"
              label="Secondary Phone"
              value={formik.values.secondaryPhone}
              className={classes.field}
              onChange={formik.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Smartphone />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="personalEmail"
              name="personalEmail"
              variant="standard"
              placeholder="Personal Email"
              type="email"
              label="Personal Email"
              className={classes.field}
              value={formik.values.personalEmail}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              onChange={formik.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="companyEmail"
              name="companyEmail"
              variant="standard"
              placeholder="Company Email"
              type="email"
              label="Company Email"
              className={classes.field}
              value={formik.values.companyEmail}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              onChange={formik.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="addressInput"
              name="address"
              variant="standard"
              placeholder="Address"
              label="Address"
              className={classes.field}
              value={formik.values.address}
              onChange={formik.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="website"
              name="website"
              variant="standard"
              placeholder="Website"
              type="url"
              label="Website"
              className={classes.field}
              value={formik.values.website}
              onChange={formik.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Language />
                  </InputAdornment>
                )
              }}
            />
          </div>
        </section>
        <div className={css.buttonArea}>
          <Button variant="contained" color="secondary" type="submit" disabled={formik.isSubmitting}>
            Submit
          </Button>
          <Button
            type="button"
            disabled={formik.isSubmitting || !formik.dirty}
            onClick={reset}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}

AddContactForm.propTypes = {
  sendValues: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  imgAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default AddContactForm;
