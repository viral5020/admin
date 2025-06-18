import React, { useCallback } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import * as yup from 'yup';
import { CrudTableForm, Notification } from 'dan-components';
import {
  fetchData,
  addNew,
  submitData,
  closeForm,
  removeRow,
  editRow,
  closeNotif
} from '../reducers/crudTbFrmSlice';
import { anchorTable, dataApi } from './sampleData';

const validationSchema = yup.object({
  text: yup
    .string()
    .required('this field is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
});

const useStyles = makeStyles()(() => ({
  root: {
    flexGrow: 1,
  },
  field: {
    width: '100%',
    marginBottom: 20
  },
  fieldBasic: {
    width: '100%',
    marginBottom: 20,
    marginTop: 10
  },
  inlineWrap: {
    display: 'flex',
    flexDirection: 'row'
  }
}));

function CrudTbFormDemo() {
  const {
    classes
  } = useStyles();

  // Redux State
  const branch = 'crudTbFrmDemo';
  const initValues = useSelector(state => state.crudTableForm[branch].formValues);
  const dataTable = useSelector(state => state.crudTableForm[branch].dataTable);
  const openForm = useSelector(state => state.crudTableForm[branch].showFrm);
  const messageNotif = useSelector(state => state.crudTableForm[branch].notifMsg);

  const dispatch = useDispatch();

  const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });

  const formik = useFormik({
    initialValues: initValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: useCallback(async (values) => {
      await sleep(500);
      dispatch(submitData({ newData: values, branch }));
    }, [submitData, branch]),
  });

  return (
    <div>
      <Notification close={() => dispatch(closeNotif({ branch }))} message={messageNotif} />
      <div className={classes.rootTable}>
        <CrudTableForm
          dataTable={dataTable}
          openForm={openForm}
          dataInit={dataApi}
          anchor={anchorTable}
          title="Title of Table"
          fetchData={(items) => dispatch(fetchData({ items, branch }))}
          addNew={(anchor) => dispatch(addNew({ anchor, branch }))}
          closeForm={() => dispatch(closeForm({ branch }))}
          removeRow={(item) => dispatch(removeRow({ item, branch }))}
          editRow={(item) => dispatch(editRow({ item, branch }))}
          branch={branch}
          formik={formik}
          initValues={initValues}
        >
          {/* Create Your own form, then arrange or custom it as You like */}
          <div>
            <TextField
              id="text"
              name="text"
              variant="standard"
              placeholder="Text Field"
              label="Text Field"
              required
              className={classes.field}
              value={formik.values.text}
              onChange={formik.handleChange}
              error={formik.touched.text && Boolean(formik.errors.text)}
              helperText={formik.touched.text && formik.errors.text}
            />
          </div>
          <div>
            <TextField
              id="email"
              name="email"
              variant="standard"
              placeholder="Email Field"
              label="Email"
              required
              className={classes.field}
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </div>
          <div className={classes.fieldBasic}>
            <FormLabel component="label">Choose One Option</FormLabel>
            <RadioGroup
              id="radio"
              name="radio"
              className={classes.inlineWrap}
              value={formik.values.radio}
              onChange={formik.handleChange}
            >
              <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
              <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
            </RadioGroup>
          </div>
          <div>
            <FormControl variant="standard" className={classes.field}>
              <InputLabel htmlFor="selection">Selection</InputLabel>
              <Select
                id="selection"
                name="selection"
                placeholder="Selection"
                autoWidth
                value={formik.values.selection}
                onChange={formik.handleChange}
              >
                <MenuItem value="option1">Option One</MenuItem>
                <MenuItem value="option2">Option Two</MenuItem>
                <MenuItem value="option3">Option Three</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={classes.fieldBasic}>
            <FormLabel component="label">Toggle Input</FormLabel>
            <FormGroup row className={classes.inlineWrap}>
              <FormControlLabel
                control={
                  <Switch
                    id="onof"
                    name="onof"
                    checked={formik.values.onof}
                    onChange={formik.handleChange}
                  />
                }
                label="Switch ON/OFF"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    id="checkbox"
                    name="checkbox"
                    checked={formik.values.checkbox}
                    onChange={formik.handleChange}
                  />
                }
                label="Checkbox"
              />
            </FormGroup>
          </div>
          <div className={classes.field}>
            <TextField
              id="textarea"
              name="textarea"
              variant="standard"
              className={classes.field}
              label="Textarea"
              multiline
              rows={4}
              value={formik.values.textarea}
              onChange={formik.handleChange}
            />
          </div>
          {/* No need create button or submit, because that already made in this component */}
        </CrudTableForm>
      </div>
    </div>
  );
}

export default CrudTbFormDemo;
