import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { ContactList, ChatRoom } from 'dan-components';
import useStyles from 'dan-components/Contact/contact-jss';
import {
  fetchData as fetchChat, showChat,
  hideChat, send, deleteMessage
} from './reducers/chatSlice';
import { fetchData as fetchContact, search } from '../Contact/reducers/contactSlice';
import contactData from '../Contact/api/contactData';
import chatData from './api/chatData';

function Chat() {
  // Redux State
  const dataContact = useSelector(state => state.contact.contactList);
  const keyword = useSelector(state => state.contact.keyword);
  const dataChat = useSelector(state => state.chat.activeChat);
  const chatSelected = useSelector(state => state.chat.chatSelected);
  const showMobileDetail = useSelector(state => state.chat.showMobileDetail);

  // Dispatcher
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchChat(chatData));
    dispatch(fetchContact(contactData));
  }, []);

  const title = brand.name + ' - Chat App';
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
      <div className={classes.root}>
        <ContactList
          total={dataContact.length}
          keyword={keyword}
          itemSelected={chatSelected}
          dataContact={dataContact}
          search={(payload) => dispatch(search(payload))}
          showDetail={(payload) => dispatch(showChat(payload))}
        />
        <ChatRoom
          showMobileDetail={showMobileDetail}
          dataChat={dataChat}
          chatSelected={chatSelected}
          dataContact={dataContact}
          sendMessage={(payload) => dispatch(send(payload))}
          remove={() => dispatch(deleteMessage())}
          hideDetail={() => dispatch(hideChat())}
        />
      </div>
    </div>
  );
}

export default Chat;
