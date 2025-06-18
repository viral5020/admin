/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineSlices } from '@reduxjs/toolkit';

import language from 'containers/LanguageProvider/reducer';
import uiReducer from './modules/ui';
import treeTable from '../containers/Tables/reducers/treeTbSlice';
import crudTable from '../containers/Tables/reducers/crudTbSlice';
import crudTableForm from '../containers/Tables/reducers/crudTbFrmSlice';
import contact from '../containers/SampleApps/Contact/reducers/contactSlice';
import email from '../containers/SampleApps/Email/reducers/emailSlice';
import socmed from '../containers/SampleApps/Timeline/reducers/timelineSlice';
import chat from '../containers/SampleApps/Chat/reducers/chatSlice';
import ecommerce from '../containers/SampleApps/Ecommerce/reducers/ecommerceSlice';
import calendar from '../containers/SampleApps/Calendar/reducers/calendarSlice';
import taskboard from '../containers/SampleApps/TaskBoard/reducers/taskboardSlice';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default combineSlices({
  ui: uiReducer,
  treeTable,
  language,
  crudTable,
  crudTableForm,
  contact,
  email,
  socmed,
  chat,
  ecommerce,
  calendar,
  taskboard
});
