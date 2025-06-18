import { createSlice } from '@reduxjs/toolkit';
import notif from 'dan-api/ui/notifMessage';

const defaultState = {
  dataTable: [],
  dataInit: [
    {
      id: 0,
      category: '',
      price: '',
      date: '',
      time: '',
      name: '',
      available: false,
      edited: true,
    }
  ],
  notifMsg: '',
};

const initialState = {
  crudTableDemo: defaultState
};

const initialItem = (keyTemplate, anchor) => {
  const [...rawKey] = Object.keys(keyTemplate);
  const staticKey = {
    id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
  };
  for (let i = 0; i < rawKey.length; i += 1) {
    if (rawKey[i] !== 'id' && rawKey[i] !== 'edited') {
      staticKey[rawKey[i]] = anchor[i].initialValue;
    }
  }
  // Push another static key
  staticKey.edited = true;

  return staticKey;
};

const crudTbSlice = createSlice({
  name: 'crudTable',
  initialState,
  reducers: {
    fetchData: (state, action) => {
      const { branch, items } = action.payload;
      const thisState = state[branch];

      thisState.dataTable = items;
    },
    addEmptyRow: (state, action) => {
      const { branch, anchor } = action.payload;
      const thisState = state[branch];

      const raw = thisState.dataInit[thisState.dataInit.length - 1];
      const initial = initialItem(raw, anchor);

      thisState.dataTable.unshift(initial);
    },
    removeRow: (state, action) => {
      const { branch, item } = action.payload;
      const thisState = state[branch];

      const index = thisState.dataTable.findIndex(obj => obj.id === item.id);
      if (index !== -1) {
        thisState.dataTable.splice(index, 1);
        thisState.notifMsg = notif.removed;
      }
    },
    updateRow: (state, action) => {
      const { branch, item, event } = action.payload;
      const thisState = state[branch];

      const index = thisState.dataTable.findIndex(obj => obj.id === item.id);
      const cellTarget = event.target.name;
      const newVal = type => {
        if (type === 'checkbox') {
          return event.target.checked;
        }
        return event.target.value;
      };
      if (index !== -1) {
        thisState.dataTable[index][cellTarget] = newVal(event.target.type);
      }
    },
    editRow: (state, action) => {
      const { branch, item } = action.payload;
      const thisState = state[branch];

      const index = thisState.dataTable.findIndex(obj => obj.id === item.id);
      if (index !== -1) {
        thisState.dataTable[index].edited = true;
      }
    },
    saveRow: (state, action) => {
      const { branch, item } = action.payload;
      const thisState = state[branch];

      const index = thisState.dataTable.findIndex(obj => obj.id === item.id);
      if (index !== -1) {
        thisState.dataTable[index].edited = false;
        thisState.notifMsg = notif.saved;
      }
    },
    closeNotif: (state, action) => {
      const { branch } = action.payload;
      const thisState = state[branch];
      thisState.notifMsg = '';
    }
  }
});

export const {
  fetchData, addEmptyRow, removeRow,
  updateRow, editRow, saveRow,
  closeNotif
} = crudTbSlice.actions;

export default crudTbSlice.reducer;
