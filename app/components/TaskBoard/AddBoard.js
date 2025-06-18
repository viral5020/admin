import React from 'react';
import PropTypes from 'prop-types';
import Fab from '@mui/material/Fab';
import Add from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import FloatingPanel from '../Panel/FloatingPanel';
import AddBoardForm from './AddBoardForm';
import useStyles from './taskBoard-jss.js';

function AddEvent(props) {
  const { classes } = useStyles();
  const {
    openForm,
    closeForm,
    addEvent,
    submit,
    initialValues
  } = props;

  const sendValues = (values) => {
    setTimeout(() => {
      submit(values); // eslint-disable-line
    }, 500); // simulate server latency
  };

  const branch = '';

  return (
    <div>
      <Tooltip title="Add New Board">
        <Fab color="secondary" onClick={() => addEvent()} className={classes.addBtn}>
          <Add />
        </Fab>
      </Tooltip>
      <FloatingPanel title="Add New Board" openForm={openForm} branch={branch} closeForm={() => closeForm()}>
        <AddBoardForm
          initialValues={initialValues}
          sendValues={(values) => sendValues(values)}
        />
      </FloatingPanel>
    </div>
  );
}

AddEvent.propTypes = {
  openForm: PropTypes.bool.isRequired,
  addEvent: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
};

export default AddEvent;
