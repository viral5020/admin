import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { useSelector, useDispatch } from 'react-redux';
import {
  Timeline,
  WritePost,
  SideSection,
  Notification
} from 'dan-components';
import data from './api/timelineData';
import {
  fetchData, post, toggleLike,
  fetchComment, postComment, closeNotif
} from './reducers/timelineSlice';

function TimelineSocial() {
  // Redux State
  const dataProps = useSelector(state => state.socmed.dataTimeline);
  const commentIndex = useSelector(state => state.socmed.commentIndex);
  const messageNotif = useSelector(state => state.socmed.notifMsg);

  // Distpatcher
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData(data));
  }, []);

  const title = brand.name + ' - Social Media';
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
      <Grid
        container
        alignItems="flex-start"
        justifyContent="flex-start"
        direction="row"
        spacing={3}
      >
        <Grid item md={8} xs={12}>
          <div>
            <WritePost submitPost={(text, media, privacy) => dispatch(post({ text, media, privacy }))} />
            <Timeline
              dataTimeline={dataProps}
              onlike={(payload) => dispatch(toggleLike(payload))}
              submitComment={(payload) => dispatch(postComment(payload))}
              fetchComment={(payload) => dispatch(fetchComment(payload))}
              commentIndex={commentIndex}
            />
          </div>
        </Grid>
        <Grid item md={4} xs={12}>
          <SideSection />
        </Grid>
      </Grid>
    </div>
  );
}

export default TimelineSocial;
