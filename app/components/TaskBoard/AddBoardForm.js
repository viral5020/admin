import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import css from 'dan-styles/Form.scss';
import useStyles from './taskBoard-jss';

const validationSchema = yup.object({
  title: yup
    .string('this field is required')
    .required('this field is required'),
});

function AddBoardForm(props) {
  const { classes } = useStyles();
  const { sendValues, initialValues } = props;

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
            <TextField
              id="title"
              name="title"
              variant="standard"
              placeholder="Board Name"
              label="Board Name"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              className={classes.field}
            />
          </div>
          <div>
            <TextField
              name="label"
              variant="standard"
              value={formik.values.label}
              onChange={formik.handleChange}
              placeholder="Label"
              label="Label"
              className={classes.field}
            />
          </div>
          <div className={classes.fieldBasic}>
            <FormLabel component="label">Accent Color</FormLabel>
            <RadioGroup
              id="color"
              name="color"
              value={formik.values.color}
              onChange={formik.handleChange}
              className={classes.inlineWrap}
            >
              <FormControlLabel value="#EC407A" control={<Radio className={classes.redRadio} classes={{ root: classes.redRadio, checked: classes.checked }} />} label="Red" />
              <FormControlLabel value="#43A047" control={<Radio className={classes.greenRadio} classes={{ root: classes.greenRadio, checked: classes.checked }} />} label="Green" />
              <FormControlLabel value="#2096f3" control={<Radio className={classes.blueRadio} classes={{ root: classes.blueRadio, checked: classes.checked }} />} label="Blue" />
              <FormControlLabel value="#AB47BC" control={<Radio className={classes.violetRadio} classes={{ root: classes.violetRadio, checked: classes.checked }} />} label="Violet" />
              <FormControlLabel value="#FF5722" control={<Radio className={classes.orangeRadio} classes={{ root: classes.orangeRadio, checked: classes.checked }} />} label="Orange" />
            </RadioGroup>
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

AddBoardForm.propTypes = {
  sendValues: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
};

export default AddBoardForm;
