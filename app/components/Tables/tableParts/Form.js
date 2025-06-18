import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import css from 'dan-styles/Form.scss';

function Form(props) {
  const { children, initValues, formik } = props;
  const reset = () => {
    formik.resetForm({
      values: initValues
    });
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <section className={css.bodyForm}>
          {children}
        </section>
        <div className={css.buttonArea}>
          <Button variant="contained" color="secondary" type="submit" disabled={formik.isSubmitting}>
            Submit
          </Button>
          <Button
            type="button"
            disabled={formik.isSubmitting}
            onClick={reset}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
  formik: PropTypes.object.isRequired,
  initValues: PropTypes.object.isRequired,
};

export default Form;
