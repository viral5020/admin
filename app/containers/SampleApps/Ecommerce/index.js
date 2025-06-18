import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { useSelector, useDispatch } from 'react-redux';
import { SearchProduct, ProductGallery, Notification } from 'dan-components';
import {
  fetchData, search, addToCart,
  deleteCartItem, checkout, showDetail,
  closeNotif
} from './reducers/ecommerceSlice';
import data from './api/productData';

function Ecommerce() {
  // Redux State
  const keyword = useSelector(state => state.ecommerce.keywordValue);
  const dataProduct = useSelector(state => state.ecommerce.productList);
  const dataCart = useSelector(state => state.ecommerce.cart);
  const productIndex = useSelector(state => state.ecommerce.productIndex);
  const totalItems = useSelector(state => state.ecommerce.totalItems);
  const totalPrice = useSelector(state => state.ecommerce.totalPrice);
  const messageNotif = useSelector(state => state.ecommerce.notifMsg);

  // Dispatcher
  const dispatch = useDispatch();

  const [listView, setListView] = useState('grid');

  useEffect(() => {
    dispatch(fetchData(data));
  }, []);

  const handleSwitchView = (event, value) => {
    setListView(value);
  };

  const title = brand.name + ' - Ecommerce';
  const description = brand.desc;

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
      <SearchProduct
        dataCart={dataCart}
        dataProduct={dataProduct}
        removeItem={(payload) => dispatch(deleteCartItem(payload))}
        checkout={() => dispatch(checkout())}
        totalItems={totalItems}
        totalPrice={totalPrice}
        search={(payload) => dispatch(search(payload))}
        keyword={keyword}
        listView={listView}
        handleSwitchView={handleSwitchView}
      />
      <ProductGallery
        listView={listView}
        dataProduct={dataProduct}
        showDetail={(payload) => dispatch(showDetail(payload))}
        handleAddToCart={(payload) => dispatch(addToCart(payload))}
        productIndex={productIndex}
        keyword={keyword}
      />
    </div>
  );
}

export default Ecommerce;
