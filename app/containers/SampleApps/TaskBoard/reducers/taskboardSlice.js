import { createSlice } from '@reduxjs/toolkit';
import notif from 'dan-api/ui/notifMessage';

const defaultVal = {
  title: '',
  label: '',
  color: '#EC407A',
  cards: []
};

const initialState = {
  boardData: { lanes: [] },
  openFrm: false,
  formValues: defaultVal,
  notifMsg: '',
};

const buildLanes = (board) => {
  const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  return {
    id,
    title: board.title,
    label: board.label,
    color: board.color,
    cards: [],
  };
};

const taskboardSlice = createSlice({
  name: 'taskboard',
  initialState,
  reducers: {
    fetchData: (state, action) => {
      const items = action.payload;
      state.boardData = items;
    },
    addBoard: (state) => {
      state.openFrm = true;
    },
    discardBoard: (state) => {
      state.openFrm = false;
      state.formValues = defaultVal;
      state.notifMsg = notif.discard;
    },
    submitBoard: (state, action) => {
      const newBoard = action.payload;
      const newLanes = buildLanes(newBoard);
      state.boardData.lanes.push(newLanes);
      state.formValues = defaultVal;
      state.openFrm = false;
      state.notifMsg = notif.saved;
    },
    deleteBoard: (state, action) => {
      const boardId = action.payload;
      const index = state.boardData.lanes.findIndex((obj) => obj.id === boardId);
      if (index !== -1) {
        state.boardData.lanes.splice(index, 1);
        state.notifMsg = notif.removed;
      }
    },
    closeNotif: state => {
      state.notifMsg = '';
    },
  }
});

export const {
  fetchData, addBoard, discardBoard,
  submitBoard, deleteBoard, closeNotif
} = taskboardSlice.actions;

export default taskboardSlice.reducer;
