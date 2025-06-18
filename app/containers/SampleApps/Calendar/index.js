import React, { useState, useEffect } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import 'dan-styles/vendors/react-big-calendar/react-big-calendar.css';
import {
  EventCalendar,
  DetailEvent,
  AddEvent,
  Notification
} from 'dan-components';
import {
  fetchData, addNewEvent, discard,
  submitEvent, deleteEvent, closeNotif
} from './reducers/calendarSlice';
import events from './api/eventData';

const useStyles = makeStyles()(() => ({
  root: {
    display: 'block'
  }
}));

function Calendar() {
  // Redux State
  const initialValues = useSelector(state => state.calendar.formValues);
  const eventData = useSelector(state => state.calendar.events);
  const openFrm = useSelector(state => state.calendar.openFrm);
  const messageNotif = useSelector(state => state.calendar.notifMsg);

  // Dispatcher
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(false);
  const [event, setEvent] = useState(null);
  const [anchorPos, setAnchorPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    dispatch(fetchData(events));
  }, []);

  const handleClick = e => {
    setTimeout(() => {
      const target = document.getElementsByClassName('rbc-selected')[0];
      const targetBounding = target.getBoundingClientRect();
      setEvent(e);
      setAnchorEl(true);
      setAnchorPos({ top: targetBounding.top, left: targetBounding.left });
    }, 200);
  };

  const handleClose = () => {
    setAnchorEl(false);
  };

  const title = brand.name + ' - Calendar';
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
      <div className={classes.root}>
        <EventCalendar events={eventData} handleEventClick={(e) => handleClick(e)} />
        <DetailEvent
          event={event}
          anchorEl={anchorEl}
          anchorPos={anchorPos}
          close={handleClose}
          remove={(payload) => dispatch(deleteEvent(payload))}
        />
        <AddEvent
          openForm={openFrm}
          addEvent={() => dispatch(addNewEvent())}
          closeForm={() => dispatch(discard())}
          submit={(payload) => dispatch(submitEvent(payload))}
          initialValues={initialValues}
        />
      </div>
    </div>
  );
}

export default Calendar;
