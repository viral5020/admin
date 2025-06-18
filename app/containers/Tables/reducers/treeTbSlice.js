import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
  treeOpen: [],
  arrowMore: []
};

const initialState = {
  arrow: defaultState,
  icon: defaultState,
};

// Collect existing child and parent id's
function collectId(id, listedId, collapsed, arrowLess) {
  arrowLess.push(id);
  for (let i = 0; i < listedId.length; i += 1) {
    if (listedId[i].startsWith(id + '_')) {
      collapsed.push(listedId[i]);
      arrowLess.push(listedId[i]);
    }
  }
}

const treeTbSlice = createSlice({
  name: 'treeTable',
  initialState,
  reducers: {
    toggleTree: (state, action) => {
      const { id, branch, child } = action.payload;
      const thisState = state[branch];

      const listedId = thisState.treeOpen;
      const collapsed = [];
      const arrowLess = [];

      // Collect existing id
      collectId(id, listedId, collapsed, arrowLess);

      // Collapse and Expand row
      if (collapsed.length > 0) { // Collapse tree table
        thisState.treeOpen = thisState.treeOpen.filter(x => collapsed.indexOf(x) < 0);
        thisState.arrowMore = thisState.arrowMore.filter(x => arrowLess.indexOf(x) < 0);
      } else { // Expand tree table
        thisState.arrowMore.push(id);
        child.map(item => {
          thisState.treeOpen.push(item.id);
          return true;
        });
      }
    }
  }
});

export const { toggleTree } = treeTbSlice.actions;

export default treeTbSlice.reducer;
