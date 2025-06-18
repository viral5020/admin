import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import css from 'dan-styles/Form.scss';
import useStyles from './calendar-jss';

const validationSchema = yup.object({
  title: yup
    .string('this field is required')
    .required('this field is required'),
});

const DateTimePickerRow = props => {
  const {
    showErrorsInline,
    onChange,
    value,
    ...other
  } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <MobileDatePicker
        label="DateTimePicker"
        inputFormat="DD/MM/YYYY"
        value={value || new Date()}
        onChange={onChange}
        renderInput={(params) => (
          <TextField {...params} variant="standard" />
        )}
        {...other}
      />
    </LocalizationProvider>
  );
};

DateTimePickerRow.propTypes = {
  showErrorsInline: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
};

DateTimePickerRow.defaultProps = {
  showErrorsInline: false,
};

function AddEventForm(props) {
  const { initialValues, sendValues } = props;

  const { classes } = useStyles();

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
              placeholder="Event Name"
              label="Event Name"
              value={formik.values.title}
              className={classes.field}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              onChange={formik.handleChange}
            />
          </div>
          <div>
            <DateTimePickerRow
              id="startDate"
              name="startDate"
              variant="standard"
              placeholder="Start Date"
              value={formik.values.startDate}
              onChange={(value) => {
                formik.setFieldValue('startDate', value.toDate());
              }}
              label="Start Date"
              className={classes.field}
            />
          </div>
          <div>
            <DateTimePickerRow
              id="endDate"
              name="endDate"
              variant="standard"
              placeholder="End Date"
              value={formik.values.endDate}
              onChange={(value) => {
                formik.setFieldValue('endDate', value.toDate());
              }}
              label="Start Date"
              className={classes.field}
            />
          </div>
          <div className={classes.fieldBasic}>
            <FormLabel component="label">Label Color</FormLabel>
            <RadioGroup
              id="hexColor"
              name="hexColor"
              value={formik.values.hexColor}
              onChange={formik.handleChange}
              className={classes.inlineWrap}
            >
              <FormControlLabel value="EC407A" control={<Radio className={classes.redRadio} classes={{ root: classes.redRadio, checked: classes.checked }} />} label="Red" />
              <FormControlLabel value="43A047" control={<Radio className={classes.greenRadio} classes={{ root: classes.greenRadio, checked: classes.checked }} />} label="Green" />
              <FormControlLabel value="2096f3" control={<Radio className={classes.blueRadio} classes={{ root: classes.blueRadio, checked: classes.checked }} />} label="Blue" />
              <FormControlLabel value="AB47BC" control={<Radio className={classes.violetRadio} classes={{ root: classes.violetRadio, checked: classes.checked }} />} label="Violet" />
              <FormControlLabel value="FF5722" control={<Radio className={classes.orangeRadio} classes={{ root: classes.orangeRadio, checked: classes.checked }} />} label="Orange" />
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

AddEventForm.propTypes = {
  sendValues: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
};

export default AddEventForm;
