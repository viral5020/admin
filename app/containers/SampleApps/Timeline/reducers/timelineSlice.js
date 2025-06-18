import { createSlice } from '@reduxjs/toolkit';
import notif from 'dan-api/ui/notifMessage';
import dummy from 'dan-api/dummy/dummyContents';
import { getDate, getTime } from '../../../helpers/dateTimeHelper';

const initialState = {
  dataTimeline: [],
  commentIndex: 0,
  notifMsg: '',
};

const icon = privacyType => {
  switch (privacyType) {
    case 'public':
      return 'language';
    case 'friends':
      return 'people';
    default:
      return 'lock';
  }
};

const buildPost = (text, image, privacy) => {
  const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  const imageSrc = image.length > 0 ? URL.createObjectURL(image[0]) : '';
  return {
    id,
    name: 'John Doe',
    date: getDate(),
    time: getTime(),
    icon: icon(privacy),
    avatar: dummy.user.avatar,
    image: imageSrc,
    content: text,
    liked: false,
    comments: []
  };
};

const buildComment = message => {
  const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  return {
    id,
    from: 'John Doe',
    avatar: dummy.user.avatar,
    date: getDate(),
    message
  };
};

const timelineSlice = createSlice({
  name: 'socmed',
  initialState,
  reducers: {
    fetchData: (state, action) => {
      const items = action.payload;
      state.dataTimeline = items;
    },
    post: (state, action) => {
      const { text, media, privacy } = action.payload;
      state.dataTimeline.unshift(buildPost(text, media, privacy));
      console.log(media);
      state.notifMsg = notif.posted;
    },
    toggleLike: (state, action) => {
      const item = action.payload;
      const index = state.dataTimeline.findIndex((obj) => obj.id === item.id);
      state.dataTimeline[index].liked = !state.dataTimeline[index].liked;
    },
    fetchComment: (state, action) => {
      const item = action.payload;
      const index = state.dataTimeline.findIndex((obj) => obj.id === item.id);
      if (index !== -1) {
        state.commentIndex = index;
      }
    },
    postComment: (state, action) => {
      const commentRaw = action.payload;
      const comment = buildComment(commentRaw);
      state.dataTimeline[state.commentIndex].comments.unshift(comment);
      state.notifMsg = notif.commented;
    },
    closeNotif: state => {
      state.notifMsg = '';
    },
  }
});

export const {
  fetchData, post, toggleLike,
  fetchComment, postComment, closeNotif
} = timelineSlice.actions;

export default timelineSlice.reducer;
