import { createSlice } from '@reduxjs/toolkit';
import { getDate, getTime } from '../../../helpers/dateTimeHelper';

const initialState = {
  chatList: [],
  activeChat: [],
  chatSelected: 0,
  showMobileDetail: false
};

const buildMessage = message => {
  const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  const newData = {
    id,
    from: 'me',
    date: getDate(),
    time: getTime(),
    message,
  };
  return newData;
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    fetchData: (state, action) => {
      const items = action.payload;
      state.chatList = items;
      state.activeChat = items[state.chatSelected].chat;
    },
    showChat: (state, action) => {
      const person = action.payload;
      const index = state.chatList.findIndex((obj) => obj.with === person.id);

      if (index !== -1) {
        state.chatSelected = index;
        state.activeChat = state.chatList[index].chat;
        state.showMobileDetail = true;
      }
    },
    hideChat: (state) => {
      state.showMobileDetail = false;
    },
    send: (state, action) => {
      const message = action.payload;
      const newMessage = buildMessage(message);
      state.chatList[state.chatSelected].chat.push(newMessage);
      state.activeChat = state.chatList[state.chatSelected].chat;
    },
    deleteMessage: (state) => {
      state.chatList[state.chatSelected].chat = [];
      state.activeChat = [];
    }
  }
});

export const {
  fetchData, showChat, hideChat,
  send, deleteMessage
} = chatSlice.actions;

export default chatSlice.reducer;
