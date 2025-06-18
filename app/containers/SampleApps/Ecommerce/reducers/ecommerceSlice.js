import { createSlice } from '@reduxjs/toolkit';
import notif from 'dan-api/ui/notifMessage';

const initialState = {
  productList: [],
  cart: [],
  totalItems: 0,
  totalPrice: 0,
  productIndex: 0,
  keywordValue: '',
  notifMsg: '',
};

let itemId = [];

const ecommerceSlice = createSlice({
  name: 'ecommerce',
  initialState,
  reducers: {
    fetchData: (state, action) => {
      const items = action.payload;
      state.productList = items;
    },
    search: (state, action) => {
      const keyword = action.payload;
      state.keywordValue = keyword;
    },
    addToCart: (state, action) => {
      const item = action.payload;
      const qty = Number(item.quantity);
      const price = Number(item.price);
      const index = itemId.indexOf(item.id);

      if (index !== -1) {
        // If item already added to cart
        state.cart[index].quantity += qty;
      } else {
        // item not exist in cart
        itemId.push(item.id);
        state.cart.push(item);
      }
      state.totalItems += qty;
      state.totalPrice += (price * qty);
      state.notifMsg = notif.addCart;
    },
    deleteCartItem: (state, action) => {
      const item = action.payload;
      const index = state.cart.findIndex((obj) => obj.id === item.id);

      const qty = Number(item.quantity);
      const newPrice = item.price;

      itemId = itemId.filter((obj) => obj !== item.id);

      if (index !== -1) {
        state.cart.splice(index, 1);
        state.totalItems -= qty;
        state.totalPrice -= (newPrice * qty);
        state.notifMsg = notif.removed;
      }
    },
    checkout: (state) => {
      itemId = [];
      state.cart = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.notifMsg = notif.checkout;
    },
    showDetail: (state, action) => {
      const item = action.payload;
      const index = state.productList.findIndex((obj) => obj.id === item.id);
      if (index !== -1) {
        state.productIndex = index;
      }
    },
    closeNotif: state => {
      state.notifMsg = '';
    },
  }
});

export const {
  fetchData, search, addToCart,
  deleteCartItem, checkout, showDetail,
  closeNotif
} = ecommerceSlice.actions;

export default ecommerceSlice.reducer;
