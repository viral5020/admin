import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useFormik } from 'formik';
import * as yup from 'yup';
import brand from 'dan-api/dummy/brand';
import logo from 'dan-images/logo.svg';
import useStyles from './user-jss';
// import { fetchNotificationAPI } from 'app/containers/Dashboard/API/API';
// import { fetchNotificationAPI } from '../../containers/Dashboard/API/API';

const validationSchema = yup.object({
  password: yup
    .string('Enter your password')
    .required('Password is required'),
});

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
  return <NavLink to={props.to} {...props} />; // eslint-disable-line
});

const types = [
  { url: '/login', name: 'user', api: 'ajaxfiles/logincheck', username: '', password: 'Abcd1234' },
  { url: '/login-v3', name: 'Admin', api: 'main-ad98min-login/ad_min/login1/login_process', username: '34569', password: '66774422' },
  { url: '/login-emp', name: 'Empolyee', api: 'employee-login/login_process', username: 'EMP', password: '' },
]

function LoginFormV2() {
  const deco = useSelector((state) => state.ui.decoration);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const type = types.find(t => t.url === location.pathname) || types[0];
  const { value, url, name, api, username, password } = type;

  const formik = useFormik({
    initialValues: { username, password },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {

      try {
        const response = await fetch(`http://128.199.126.171/~goldorg/${api}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        console.log('API Response:', data); // Debug the API response

        const isLoginSuccessful = data.success || data.message?.toLowerCase().includes('success');

        if (isLoginSuccessful) {
          sessionStorage.setItem('data', JSON.stringify(data));

          // Adjust this property name to match the API response exactly
          const { user_id, auth_key } = data;

          // If you want a short delay before redirecting, keep setTimeout
          // setTimeout(() => {
          const rawData = sessionStorage.getItem("data");
          const parsedData = JSON.parse(rawData);
          const userType = parseInt(parsedData.user_type, 10);

          console.log('Redirecting based on userType:', userType);

          if (userType === 3 || userType === 4) {
            navigate("/app/dashboard/Master-Dashboard", { state: { user_id, auth_key }, replace: true });
          } else {
            navigate('/app', { state: { user_id, auth_key }, replace: true });
          }
          // }, 500);


        } else {
          alert('Login failed: ' + (data.message || 'Invalid credentials'));
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleClickShowPassword = () => {
    setShowPassword(show => !show);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const { classes, cx } = useStyles();

  return (
    <Paper className={cx(classes.sideWrap, deco && classes.petal)}>
      <div className={classes.topBar}>
        <NavLink to="/" className={classes.brand}>
          <img src={logo} alt={brand.name} />
          {brand.name}
        </NavLink>
      </div>
      <Typography variant="h4" sx={{ mt: 17 }} gutterBottom>
        Sign In
      </Typography>

      <section className={classes.pageFormSideWrap}>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <FormControl variant="standard" className={classes.formControl}>
              <TextField
                id="username"
                name="username"
                label="User Name"
                variant="standard"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                className={classes.field}
              />
            </FormControl>
          </div>
          <div>
            <FormControl variant="standard" className={classes.formControl}>
              <TextField
                id="password"
                name="password"
                label="Your Password"
                type={showPassword ? 'text' : 'password'}
                variant="standard"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                className={classes.field}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        size="large">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
            ABCD1234
          </div>
          <div className={classes.optArea} />
          <div className={classes.btnArea}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={formik.isSubmitting}
            >
              Continue
              <ArrowForward className={cx(classes.rightIcon, classes.iconSmall)} />
            </Button>
          </div>
        </form>
      </section>
    </Paper>
  );
}

export default LoginFormV2;
