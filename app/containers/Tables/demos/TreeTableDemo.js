import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TreeTable } from 'dan-components';
import useStyles from 'dan-components/Tables/tableStyle-jss';
import { toggleTree } from '../reducers/treeTbSlice';
import data from './dataTreeTable.js';

function TreeTableDemo() {
  // Redux State
  const branch = 'arrow';
  const treeOpen = useSelector((state) => state.treeTable[branch].treeOpen);
  const arrowMore = useSelector((state) => state.treeTable[branch].arrowMore);

  // Dispatcher
  const dispatch = useDispatch();

  const { classes } = useStyles();
  return (
    <div className={classes.rootTable}>
      <TreeTable
        treeOpen={treeOpen}
        toggleTree={(payload) => dispatch(toggleTree(payload))}
        arrowMore={arrowMore}
        dataTable={data}
        branch={branch}
      />
    </div>
  );
}

export default TreeTableDemo;
