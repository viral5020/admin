import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { useSelector, useDispatch } from 'react-redux';
import {
  EmailHeader,
  EmailList,
  EmailSidebar,
  ComposeEmail,
  Notification
} from 'dan-components';
import useStyles from 'dan-components/Email/email-jss';
import {
  fetchData, open, filter,
  compose, send, discard,
  search, deleteMail, toggleStar,
  move, closeNotif
} from './reducers/emailSlice';
import data from './api/emailData';

// validation functions
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : ''
);

function Email() {
  const [field, setField] = useState({
    to: '',
    subject: ''
  });
  const [validMail, setValidMail] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Redux State
  const keyword = useSelector(state => state.email.keywordValue);
  const emailData = useSelector(state => state.email.inbox);
  const currentPage = useSelector(state => state.email.currentPage);
  const openFrm = useSelector(state => state.email.openFrm);
  const messageNotif = useSelector(state => state.email.notifMsg);

  // Dispatcher
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData(data));
  }, []);

  const handleChange = (event, name) => {
    const { value } = event.target;
    if (name === 'to') {
      setValidMail(email(event.target.value));
    }
    setField(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleReply = mail => {
    dispatch(compose());
    setField({
      to: mail.name,
      subject: 'Reply: ' + mail.subject,
    });
  };

  const handleCompose = () => {
    dispatch(compose());
    setField({
      to: ' ',
      subject: ' ',
    });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { classes } = useStyles();

  const title = brand.name + ' - Email';
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
      <div className={classes.root}>
        <EmailHeader search={(payload) => dispatch(search(payload))} handleDrawerToggle={handleDrawerToggle} />
        <EmailSidebar
          compose={handleCompose}
          goto={(payload) => dispatch(filter(payload))}
          selected={currentPage}
          handleDrawerToggle={handleDrawerToggle}
          mobileOpen={mobileOpen}
        />
        <EmailList
          emailData={emailData}
          openMail={(payload) => dispatch(open(payload))}
          filterPage={currentPage}
          keyword={keyword}
          moveTo={(mail, category) => dispatch(move({ mail, category }))}
          remove={(payload) => dispatch(deleteMail(payload))}
          toggleStar={(payload) => dispatch(toggleStar(payload))}
          reply={handleReply}
        />
      </div>
      <ComposeEmail
        to={field.to}
        subject={field.subject}
        compose={handleCompose}
        validMail={validMail}
        sendEmail={(
          toPayload, subjectPayload,
          content, attachment
        ) => dispatch(send({
          to: toPayload,
          subject: subjectPayload,
          content,
          attachment
        }))}
        inputChange={(e, name) => handleChange(e, name)}
        open={openFrm}
        closeForm={() => dispatch(discard())}
      />
    </div>
  );
}

export default Email;
