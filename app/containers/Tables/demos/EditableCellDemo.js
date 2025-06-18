import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CrudTable, Notification } from 'dan-components';
import useStyles from 'dan-components/Tables/tableStyle-jss';
import {
  fetchData, addEmptyRow, removeRow,
  updateRow, editRow, saveRow,
  closeNotif,
} from '../reducers/crudTbSlice';

const columnTable = [
  {
    name: 'id',
    label: 'Id',
    type: 'static',
    initialValue: '',
    hidden: true
  }, {
    name: 'category',
    label: 'Category',
    type: 'selection',
    initialValue: 'Electronics',
    options: ['Electronics', 'Sporting Goods', 'Apparels', 'Other'],
    width: 'auto',
    hidden: false
  }, {
    name: 'price',
    label: 'Price',
    type: 'number',
    initialValue: 0,
    width: '100',
    hidden: false
  }, {
    name: 'date',
    label: 'Date Updated',
    type: 'date',
    initialValue: new Date(),
    width: 'auto',
    hidden: false
  }, {
    name: 'time',
    label: 'Time Updated',
    type: 'time',
    initialValue: new Date(),
    width: 'auto',
    hidden: false
  }, {
    name: 'name',
    label: 'Name',
    type: 'text',
    initialValue: '',
    width: 'auto',
    hidden: false
  }, {
    name: 'available',
    label: 'Available',
    type: 'toggle',
    initialValue: true,
    width: '100',
    hidden: false
  }, {
    name: 'edited',
    label: '',
    type: 'static',
    initialValue: '',
    hidden: true
  }, {
    name: 'action',
    label: 'Action',
    type: 'static',
    initialValue: '',
    hidden: false
  },
];
const dataApi = [
  {
    id: 1,
    category: 'Sporting Goods',
    price: '49.99',
    date: '4/3/2018',
    time: 'Tue Apr 03 2018 00:00:00 GMT+0700 (WIB)',
    name: 'football',
    available: true,
    edited: false,
  }, {
    id: 2,
    category: 'Other',
    price: '9.99',
    date: '4/2/2018',
    time: 'Tue Apr 03 2018 00:00:00 GMT+0700 (WIB)',
    name: 'baseball',
    available: true,
    edited: false,
  }, {
    id: 3,
    category: 'Sporting Goods',
    price: '29.99',
    date: '4/1/2018',
    time: 'Tue Apr 03 2018 00:00:00 GMT+0700 (WIB)',
    name: 'basketball',
    available: false,
    edited: false,
  }, {
    id: 4,
    category: 'Electronics',
    price: '99.99',
    date: '3/30/2018',
    time: 'Tue Apr 03 2018 00:00:00 GMT+0700 (WIB)',
    name: 'iPod Touch',
    available: true,
    edited: false,
  }, {
    id: 5,
    category: 'Electronics',
    price: '399.99',
    date: '3/29/2018',
    time: 'Tue Apr 03 2018 00:00:00 GMT+0700 (WIB)',
    name: 'iPhone 5',
    available: false,
    edited: false,
  }, {
    id: 6,
    category: 'Electronics',
    price: '199.99',
    date: '3/28/2018',
    time: 'Tue Apr 03 2018 00:00:00 GMT+0700 (WIB)',
    name: 'nexus 7',
    available: true,
    edited: false,
  }
];

function CrudTableDemo() {
  const { classes } = useStyles();

  // Redux State
  const branch = 'crudTableDemo';
  const dataTable = useSelector(state => state.crudTable[branch].dataTable);
  const messageNotif = useSelector(state => state.crudTable[branch].notifMsg);

  // Dispatcher
  const dispatch = useDispatch();

  return (
    <div>
      <Notification close={() => dispatch(closeNotif({ branch }))} message={messageNotif} />
      <div className={classes.rootTable}>
        <CrudTable
          dataInit={dataApi}
          anchor={columnTable}
          title="Inventory Data"
          dataTable={dataTable}
          fetchData={(items) => dispatch(fetchData({ items, branch }))}
          addEmptyRow={(anchor) => dispatch(addEmptyRow({ anchor, branch }))}
          removeRow={(item) => dispatch(removeRow({ item, branch }))}
          updateRow={(e, item) => dispatch(updateRow({ event: e, item, branch }))}
          editRow={(item) => dispatch(editRow({ item, branch }))}
          finishEditRow={(item) => dispatch(saveRow({ item, branch }))}
          branch={branch}
        />
      </div>
    </div>
  );
}

export default CrudTableDemo;
