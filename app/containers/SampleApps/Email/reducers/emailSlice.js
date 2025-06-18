import { createSlice } from '@reduxjs/toolkit';
import notif from 'dan-api/ui/notifMessage';
import dummyData from 'dan-api/dummy/dummyContents';
import { getDate, getTime } from '../../../helpers/dateTimeHelper';

const initialState = {
  inbox: [],
  selectedMail: 0,
  selectedMailId: '',
  keywordValue: '',
  currentPage: 'inbox',
  openFrm: false,
  notifMsg: '',
};

const buildMessage = (to, subject, content, files) => {
  const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  return {
    id,
    date: getDate(),
    time: getTime(),
    avatar: dummyData.user.avatar,
    name: to,
    subject,
    content,
    attachment: files,
    category: 'sent',
    stared: false,
  };
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    fetchData: (state, action) => {
      const items = action.payload;
      state.inbox = items;
    },
    open: (state, action) => {
      const mail = action.payload;
      const index = state.inbox.findIndex((obj) => obj.id === mail.id);
      if (index !== -1) {
        state.selectedMail = index;
      }
    },
    filter: (state, action) => {
      state.currentPage = action.payload;
    },
    compose: (state) => {
      state.openFrm = true;
    },
    send: (state, action) => {
      const {
        to, subject,
        content, attachment
      } = action.payload;
      const newMail = buildMessage(to, subject, content, attachment);

      state.inbox.unshift(newMail);
      state.selectedMail = '';
      state.openFrm = false;
      state.notifMsg = notif.sent;
    },
    discard: (state) => {
      state.openFrm = false;
      state.selectedMailId = '';
      state.notifMsg = notif.discard;
    },
    search: (state, action) => {
      const keyword = action.payload;
      state.keywordValue = keyword;
    },
    deleteMail: (state, action) => {
      const mail = action.payload;
      const index = state.inbox.findIndex((obj) => obj.id === mail.id);
      if (index !== -1) {
        state.inbox.splice(index, 1);
        state.notifMsg = notif.removed;
      }
    },
    toggleStar: (state, action) => {
      const mail = action.payload;
      const index = state.inbox.findIndex((obj) => obj.id === mail.id);
      if (index !== -1) {
        state.inbox[index].stared = !state.inbox[index].stared;
      }
    },
    move: (state, action) => {
      const { mail, category } = action.payload;
      const index = state.inbox.findIndex((obj) => obj.id === mail.id);

      state.inbox[index].category = category;
      state.notifMsg = notif.labeled;
    },
    closeNotif: state => {
      state.notifMsg = '';
    },
  }
});

export const {
  fetchData, open, filter,
  compose, send, discard,
  search, deleteMail, toggleStar,
  move, closeNotif
} = emailSlice.actions;

export default emailSlice.reducer;
