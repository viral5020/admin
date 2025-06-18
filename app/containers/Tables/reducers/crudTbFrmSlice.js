import { createSlice } from '@reduxjs/toolkit';
import notif from 'dan-api/ui/notifMessage';

const formInit = {
  id: '0',
  text: '',
  email: '',
  radio: 'option1',
  selection: 'option1',
  onof: false,
  checkbox: false,
  textarea: '',
  edited: true,
};

const defaultState = {
  dataTable: [],
  dataInit: [formInit],
  formValues: formInit,
  editingId: '',
  showFrm: false,
  notifMsg: '',
};

const initialState = {
  crudTbFrmDemo: defaultState
};

const initialItem = (keyTemplate, anchor) => {
  const [...rawKey] = Object.keys(keyTemplate);
  const staticKey = {};
  for (let i = 0; i < rawKey.length; i += 1) {
    if (rawKey[i] !== 'id') {
      const itemIndex = anchor.findIndex(a => a.name === rawKey[i]);
      staticKey[rawKey[i]] = anchor[itemIndex].initialValue;
    }
  }

  return staticKey;
};

let editingIndex = 0;

const crudTbFrmSlice = createSlice({
  name: 'crudTableForm',
  initialState,
  reducers: {
    fetchData: (state, action) => {
      const { branch, items } = action.payload;
      const thisState = state[branch];

      thisState.dataTable = items;
    },
    addNew: (state, action) => {
      const { branch, anchor } = action.payload;
      const thisState = state[branch];

      const raw = thisState.dataInit[thisState.dataInit.length - 1];
      const initial = initialItem(raw, anchor);

      thisState.formValues = initial;
      thisState.showFrm = true;
    },
    submitData: (state, action) => {
      const { branch, newData } = action.payload;
      const thisState = state[branch];

      if (thisState.editingId === newData.id) {
        // Update data
        thisState.notifMsg = notif.updated;
        thisState.dataTable[editingIndex] = newData;
      } else {
        // Insert data
        const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
        const newItem = {
          ...newData,
          id
        };
        thisState.dataTable.unshift(newItem);
        thisState.notifMsg = notif.saved;
      }
      thisState.showFrm = false;
      thisState.formValues = formInit;
    },
    closeForm: (state, action) => {
      const { branch } = action.payload;
      const thisState = state[branch];

      thisState.formValues = formInit;
      thisState.showFrm = false;
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
    editRow: (state, action) => {
      const { branch, item } = action.payload;
      const thisState = state[branch];

      editingIndex = thisState.dataTable.findIndex((obj) => obj.id === item.id);
      thisState.formValues = item;
      thisState.editingId = item.id;
      thisState.showFrm = true;
    },
    closeNotif: (state, action) => {
      const { branch } = action.payload;
      const thisState = state[branch];
      thisState.notifMsg = '';
    },
  }
});

export const {
  fetchData, addNew, submitData,
  closeForm, removeRow, editRow,
  closeNotif
} = crudTbFrmSlice.actions;

export default crudTbFrmSlice.reducer;
