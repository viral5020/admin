import React, { useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import dummy from 'dan-api/dummy/dummyContents';
import {
  ContactList,
  ContactDetail,
  AddContact,
  Notification
} from 'dan-components';
import useStyles from 'dan-components/Contact/contact-jss';
import {
  fetchData, addContact, search,
  closeForm, editContact, submitContact,
  showDetail, hideDetail, deleteContact,
  toggleFavorite, closeNotif
} from './reducers/contactSlice';
import data from './api/contactData';

function Contact() {
  // Redux State
  const initVal = useSelector(state => state.contact.formValues);
  const keyword = useSelector(state => state.contact.keyword);
  const avatarInit = useSelector(state => state.contact.avatarInit);
  const dataContact = useSelector(state => state.contact.contactList);
  const itemSelected = useSelector(state => state.contact.selectedIndex);
  const open = useSelector(state => state.contact.openFrm);
  const showMobileDetail = useSelector(state => state.contact.showMobileDetail);
  const messageNotif = useSelector(state => state.contact.notifMsg);

  // Dispatcher
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchData(data));
  }, []);

  const handleSubmitContact = (item, avatar) => {
    const avatarBase64 = typeof avatar === 'object' ? URL.createObjectURL(avatar) : avatar;
    const avatarPreview = avatar !== null ? avatarBase64 : dummy.user.avatar;
    dispatch(submitContact({ newData: item, avatar: avatarPreview }));
  };

  const title = brand.name + ' - Contact';
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
        <ContactList
          addFn
          total={dataContact.length}
          addContact={() => dispatch(addContact())}
          clippedRight
          itemSelected={itemSelected}
          keyword={keyword}
          search={(payload) => dispatch(search(payload))}
          dataContact={dataContact}
          showDetail={(payload) => dispatch(showDetail(payload))}
        />
        <ContactDetail
          showMobileDetail={showMobileDetail}
          hideDetail={() => dispatch(hideDetail())}
          dataContact={dataContact}
          itemSelected={itemSelected}
          edit={(payload) => dispatch(editContact(payload))}
          remove={(payload) => dispatch(deleteContact(payload))}
          favorite={(payload) => dispatch(toggleFavorite(payload))}
        />
      </div>
      <AddContact
        initialValues={initVal}
        addContact={() => dispatch(addContact())}
        openForm={open}
        closeForm={() => dispatch(closeForm())}
        submit={(value, avatar) => handleSubmitContact(value, avatar)}
        avatarInit={avatarInit}
      />
    </div>
  );
}

const MemoedContact = memo(Contact);
export default MemoedContact;
