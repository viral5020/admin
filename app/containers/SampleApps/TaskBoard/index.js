import React, { useState, useEffect } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { useSelector, useDispatch } from 'react-redux';
import { TaskBoard, AddBoard, Notification } from 'dan-components';
import {
  fetchData, addBoard, discardBoard,
  submitBoard, deleteBoard, closeNotif
} from './reducers/taskboardSlice';
import data from './api/taskBoardData';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'block',
    width: `calc(100% + ${theme.spacing(2)})`,
    marginLeft: theme.spacing(1) * -1
  }
}));

const parseObj = mainObj => {
  const json = JSON.stringify(mainObj);
  return JSON.parse(json);
};

function TaskBoardContainer() {
  // Redux State
  const initVal = useSelector(state => state.taskboard.formValues);
  const boardData = useSelector(state => state.taskboard.boardData);
  const openFrm = useSelector(state => state.taskboard.openFrm);
  const messageNotif = useSelector(state => state.taskboard.notifMsg);

  // Convert to writable plain obj
  const boardDataPlain = parseObj(boardData);

  // Dispatcher
  const dispatch = useDispatch();

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchData(data));
    setDataLoaded(true);
  }, []);

  const handleSubmit = value => {
    dispatch(submitBoard(value));

    // Scroll to right-end
    const taskWrap = document.getElementById('task_wrap').firstElementChild.firstElementChild;
    taskWrap.scrollLeft = taskWrap.firstElementChild.offsetWidth - taskWrap.offsetWidth;
  };

  const handleDelete = async (id) => {
    await dispatch(deleteBoard(id));
  };

  const title = brand.name + ' - Task Board';
  const description = brand.desc;
  const { classes } = useStyles();

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
      <Notification close={() => dispatch(closeNotif())} message={messageNotif} />
      <div className={classes.root} id="task_wrap">
        <TaskBoard dataLoaded={dataLoaded} data={boardDataPlain} removeBoard={(id) => handleDelete(id)} />
        <AddBoard
          openForm={openFrm}
          addEvent={() => dispatch(addBoard())}
          closeForm={() => dispatch(discardBoard())}
          submit={(value) => handleSubmit(value)}
          initialValues={initVal}
        />
      </div>
    </div>
  );
}

export default TaskBoardContainer;
