import { createSlice } from '@reduxjs/toolkit';
import notif from 'dan-api/ui/notifMessage';

const defaultVal = {
  name: '',
  title: '',
  phone: '',
  secondaryPhone: '',
  personalEmail: '',
  companyEmail: '',
  address: '',
  website: ''
};

const initialState = {
  contactList: [],
  formValues: defaultVal,
  selectedIndex: 0,
  keyword: '',
  selectedId: '',
  avatarInit: '',
  openFrm: false,
  showMobileDetail: false,
  notifMsg: '',
  initVal: defaultVal
};
let editingIndex = 0;

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    fetchData: (state, action) => {
      const items = action.payload;
      state.contactList = items;
    },
    addContact: (state) => {
      state.openFrm = true;
      state.formValues = defaultVal;
      state.avatarInit = '';
    },
    closeForm: (state) => {
      state.openFrm = false;
      state.formValues = defaultVal;
      state.avatarInit = '';
      state.notifMsg = notif.discard;
    },
    search: (state, action) => {
      const val = action.payload;
      state.keyword = val;
    },
    showDetail: (state, action) => {
      const item = action.payload;
      const index = state.contactList.findIndex((obj) => obj.id === item.id);

      state.selectedIndex = index;
      state.showMobileDetail = true;
    },
    hideDetail: (state) => {
      state.showMobileDetail = false;
    },
    toggleFavorite: (state, action) => {
      const item = action.payload;
      const index = state.contactList.findIndex((obj) => obj.id === item.id);

      state.contactList[index].favorited = !state.contactList[index].favorited;
    },
    editContact: (state, action) => {
      const item = action.payload;
      editingIndex = state.contactList.findIndex((obj) => obj.id === item.id);

      state.openFrm = true;
      state.selectedId = item.id;
      state.formValues = item;
      state.avatarInit = item.avatar;
    },
    submitContact: (state, action) => {
      const { newData, avatar } = action.payload;

      if (state.selectedId === newData.id) {
        // Update data
        const newAvatar = avatar !== '' ? avatar : state.avatarInit;
        const newItem = {
          ...newData,
          avatar: newAvatar
        };
        state.contactList[editingIndex] = newItem;
        state.notifMsg = notif.updated;
      } else {
        // Insert data
        const newAvatar = avatar !== '' ? avatar : '/images/pp_boy.svg';
        const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);

        const newItem = {
          ...newData,
          id,
          avatar: newAvatar,
          favorited: false
        };
        state.contactList.unshift(newItem);
        state.selectedIndex = 0;
        state.notifMsg = notif.saved;
      }
      state.formValues = defaultVal;
      state.avatarInit = '';
      state.openFrm = false;
    },
    deleteContact: (state, action) => {
      const item = action.payload;
      const index = state.contactList.findIndex((obj) => obj.id === item.id);

      state.contactList.splice(index, 1);
      state.notifMsg = notif.removed;
    },
    closeNotif: state => {
      state.notifMsg = '';
    },
  },
});

export const {
  fetchData, addContact, search,
  closeForm, editContact, submitContact,
  showDetail, hideDetail, deleteContact,
  toggleFavorite, closeNotif
} = contactSlice.actions;

export default contactSlice.reducer;
