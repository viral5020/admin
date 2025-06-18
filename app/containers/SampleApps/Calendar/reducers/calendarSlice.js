import { createSlice } from '@reduxjs/toolkit';
import notif from 'dan-api/ui/notifMessage';

const defaultVal = {
  title: '',
  startDate: new Date(),
  endDate: new Date(),
  hexColor: 'EC407A',
};

const initialState = {
  events: [],
  openFrm: false,
  formValues: defaultVal,
  notifMsg: ''
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    fetchData: (state, action) => {
      const items = action.payload;
      state.events = items;
    },
    addNewEvent: (state) => {
      state.openFrm = true;
    },
    discard: (state) => {
      state.openFrm = false;
      state.formValues = defaultVal;
      state.notifMsg = notif.discard;
    },
    submitEvent: (state, action) => {
      const newEvent = action.payload;
      const newItem = {
        ...newEvent,
        id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
        start: newEvent.startDate,
        end: newEvent.endDate,
      };

      state.events.push(newItem);
      state.formValues = defaultVal;
      state.openFrm = false;
      state.notifMsg = notif.saved;
    },
    deleteEvent: (state, action) => {
      const event = action.payload;
      const index = state.events.findIndex((obj) => obj.id === event.id);
      if (index !== -1) {
        state.events.splice(index, 1);
        state.notifMsg = notif.removed;
      }
    },
    closeNotif: (state) => {
      state.notifMsg = '';
    }
  }
});

export const {
  fetchData, addNewEvent, discard,
  submitEvent, deleteEvent, closeNotif
} = calendarSlice.actions;

export default calendarSlice.reducer;
