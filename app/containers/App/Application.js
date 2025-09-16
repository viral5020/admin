import React, { useContext, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeContext } from './ThemeWrapper';
import Dashboard from '../Templates/Dashboard';
import {
  PersonalDashboard, CrmDashboard, CryptoDashboard,
  Infographics, MiniApps, Analytics,
  InfoUpdates, Status,
  Parent, AppLayout, Responsive, Grid,
  SimpleTable, TreeTable,
  AdvancedTable, TablePlayground, CRUDTable,
  FormikForm, DateTimePicker, CheckboxRadio,
  Switches, Selectbox, Rating,
  SliderRange, Buttons, DialButton,
  ToggleButton, Textbox,
  Autocomplete, Upload, TextEditor,
  Avatars, Accordion, Badges,
  List, PopoverTooltip, Snackbar,
  Typography, Tabs, Cards,
  ImageGrid, Progress, DialogModal,
  Steppers, Paginations, DrawerMenu,
  Breadcrumbs, Icons, IonIcons,
  SliderCarousel, Tags, Dividers,
  LineCharts, BarCharts, AreaCharts,
  PieCharts, RadarCharts, ScatterCharts, CompossedCharts,
  DoughnutCharts, BarDirection, LineScatterChart,
  AreaFilledChart, RadarPolarCharts,
  Contact, Email, Timeline,
  Chat, Profile,
  Ecommerce, ProductPage,
  Calendar, TaskBoard,
  Invoice, BlankPage,
  Photos, Pricing, CheckoutPage,
  Error, Settings, HelpSupport,
  MapMarker, MapDirection, SearchMap,
  TrafficIndicator, StreetViewMap, NotFound,
  Watchlist,
  StockDetailMobile,
  Ledger, EditDeleteLogs,
  OrderBook,
  Positions,
  BlockedScripts,
  MaxQTYDetails,
  RejectionLogs,
  Forex_order,
  Summary_report,
  Forex_position,
  TradeEditDeleteLog
} from '../pageListAsync';
import ProtectedRoute from './ProtectedRoute';
import Forexsummary from '../Dashboard/Forexsummary';
import Marginmanagement from '../Dashboard/Marginmanagement';
import Forexmarginmanagement from '../Dashboard/Forexmarginmanagement';
import BannedBlockedScript from '../Dashboard/BannedBlockedScript';
import Userlisting from '../Dashboard/Userlisting';
import MasterList from '../Dashboard/MasterList';
import BrokerListing from '../Dashboard/BrokerListing';
import Addacount from '../Dashboard/Add User/Addacount';
import Autosquareuplog from '../Dashboard/Autosquareuplog';
import Usereditlog from '../Dashboard/Usereditlog';
import Iplistlog from '../Dashboard/Iplistlog';
import Billfilter from '../Dashboard/Billfilter';
import Ledgerreport from '../Dashboard/Ledgerreport';
import Cashledger from '../Dashboard/Cashledger';
import Bulktrading from '../Dashboard/Utility/Bulktrading';
import Cashentry from '../Dashboard/Cashentry';
import JV from '../Dashboard/JV';
import Trialbalance from '../Dashboard/Trialbalance';
import Orderlimit from '../Dashboard/Orderlimit';
import Blockedallowedscript from '../Dashboard/Blockedallowedscript';
import Masterqtysetting from '../Dashboard/Masterqtysetting';
import Crosstradelog from '../Dashboard/Crosstradelog';
import Userprofile from '../Dashboard/Userprofile';
import Masterdashboard from '../Dashboard/Masterdashboard';
import Previousvalan from '../Dashboard/Previousvalan';
import Selfpl from '../Dashboard/Selfpl';
import Manualtrade from '../Dashboard/Manualtrade';

import Brokrageref from '../Dashboard/Brokrageref';
import Forexvaln from '../Dashboard/Forexvaln';
import Employeelisting from '../Dashboard/Employeelisting';
import Addemployee from '../Dashboard/Addemployee';
import Tradeditdeleteold from '../Dashboard/filters/Tradeditdeleteold';
import Casheditdeletelog from '../Dashboard/Utility/Casheditdeletelog';
import Valan from '../Dashboard/Utility/Valan';
import Scriptwiselot from '../Dashboard/Scriptwiselot';
import Addscript from '../Dashboard/Addscript';
import Addepiry from '../Dashboard/Addepiry';
import Editexpiry from '../Dashboard/Editexpiry';
import Editscript from '../Dashboard/Editscript';
import Cnbdawaz from '../Dashboard/Cnbdawaz';
import Stopfuturetrading from '../Dashboard/Stopfuturetrading';
import Splitscript from '../Dashboard/Splitscript';
import Nseoptmanagement from '../Dashboard/Nseoptmanagement';
import Marquee from '../Dashboard/Marquee';
import Expiryvalidation from '../Dashboard/Expiryvalidation';
import Notificationn from '../Dashboard/Notification';
import Timesetting from '../Dashboard/Timesetting';
import Levelimport from '../Dashboard/Levelimport';
import { useSelector } from 'react-redux';

// Patch sessionStorage.getItem to never return "undefined" or "null" as strings
(function () {
  const originalGetItem = sessionStorage.getItem;
  sessionStorage.getItem = function (key) {
    let value = originalGetItem.call(this, key);
    if (value === 'undefined' || value === 'null') return null;
    return value;
  };
})();

const OpenTrialBalanceNewTab = ({ userType }) => {
  if (userType === 4 || userType === 5) {
    // Open Trialbalance in new tab
    window.open("/dashboard/Trial-balance", "_blank");
    return <Navigate to="/app" />; // Redirect current tab if needed
  } else {
    // Unauthorized users
    return <Navigate to="/app" />;
  }
};
function Application(props) {
  const { history } = props;
  const auth = useSelector((state) => state.auth);
  const changeMode = useContext(ThemeContext);

  const isStock = auth.notificationData?.isStock;
  const isForex = auth.notificationData?.isForex;
  const userType = parseInt(auth.userData?.user_type, 10);;



  return (
    <Dashboard history={history} changeMode={changeMode}>
      <Routes>
        { /* Home */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<PersonalDashboard />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/ledger-report" element={<Ledgerreport />} />
          <Route path="/Cash-ledger" element={<Cashledger />} />


          <Route path="dashboard/watchlist" element={isStock ? <Watchlist /> : <Navigate to="/app" />} />
          <Route path="dashboard/favorite-list" element={isStock ? <Watchlist /> : <Navigate to="/app" />} />
          <Route path="dashboard/forex-watchlist" element={isForex ? <Watchlist /> : <Navigate to="/app" />} />
          <Route path="dashboard/forex-favorite-list" element={isForex ? <Watchlist /> : <Navigate to="/app" />} />

          {/* <Route path="dashboard/stock-details" element={<StockDetailMobile />} /> */}
          <Route path="dashboard/edit-Delete-Logs" element={<EditDeleteLogs />} />
          <Route path="dashboard/order-Book" element={isStock ? <OrderBook /> : <Navigate to="/app" />} />
          <Route path="dashboard/positions" element={isStock ? <Positions /> : <Navigate to="/app" />} />
          <Route path="dashboard/banned-scripts" element={<BlockedScripts />} />
          <Route path="dashboard/max-qty-details" element={userType !== 2 && userType !== 4 && userType !== 5 && isStock ? <MaxQTYDetails /> : <Navigate to="/app" />} />
          <Route path="dashboard/rejection-logs" element={<RejectionLogs />} />
          <Route path="dashboard/forex-order" element={isForex ? <Forex_order /> : <Navigate to="/app" />} />
          <Route path="dashboard/forex-position" element={isForex ? <Forex_position /> : <Navigate to="/app" />} />
          <Route path="dashboard/summary-report" element={userType !== 1 && isStock ? <Summary_report /> : <Navigate to="/app" />} />
          <Route path="dashboard/forex-Summary-report" element={userType !== 1 && isForex ? <Forexsummary /> : <Navigate to="/app" />} />
          <Route path="dashboard/Margin-management" element={userType !== 1 && userType !== 2 && isStock ? <Marginmanagement /> : <Navigate to="/app" />} />
          <Route path="dashboard/forex-Margin-management" element={userType !== 1 && userType !== 2 && isForex ? <Forexmarginmanagement /> : <Navigate to="/app" />} />
          <Route path="dashboard/Banned-Blocked-Scripts" element={userType !== 2 && isStock ? <BannedBlockedScript /> : <Navigate to="/app" />} />
          <Route path="dashboard/User-listing" element={<Userlisting />} />
          <Route path="dashboard/Master-Listing" element={<MasterList />} />
          <Route path="dashboard/Broker-Listing" element={<BrokerListing />} />
          <Route path="dashboard/Add-Account" element={<Addacount />} />
          <Route path="dashboard/Edit-Account" element={<Addacount />} />
          <Route path="dashboard/User-Profile" element={<Userprofile />} />

          <Route path="dashboard/Master-Dashboard" element={<Masterdashboard />} />

          <Route path='dashboard/trade-edit-delete-log' element={userType !== 2 && (isForex || isStock) ? <TradeEditDeleteLog /> : <Navigate to="/app" />} />
          <Route path='dashboard/auto-square-up-log' element={userType === 3 || userType === 4 || userType === 5 && (isForex || isStock) ? <Autosquareuplog /> : <Navigate to="/app" />} />
          <Route path='dashboard/user-edit-log' element={userType === 3 || userType === 4 || userType === 5 ? <Usereditlog /> : <Navigate to="/app" />} />
          <Route path='dashboard/ip-address-log' element={userType !== 2 && userType !== 1 ? <Iplistlog /> : <Navigate to="/app" />} />
          <Route path='dashboard/bill-filter' element={userType !== 2 && userType !== 1 ? <Billfilter /> : <Navigate to="/app" />} />
          <Route path='dashboard/bulk-trading' element={userType !== 1 && (isForex || isStock) ? <Bulktrading /> : <Navigate to="/app" />} />
          <Route path='dashboard/cross-trade-log' element={(userType === 3 || userType === 4 || userType === 5) && (isForex || isStock) ? <Crosstradelog /> : <Navigate to="/app" />} />

          <Route path='dashboard/previous-valan-trade' element={userType === 4 || userType === 5 ? <Previousvalan /> : <Navigate to="/app" />} />
          <Route path='dashboard/Self-P&L' element={userType === 4 ? <Selfpl /> : <Navigate to="/app" />} />
          <Route path='dashboard/manual-trade' element={userType === 4 ? <Manualtrade /> : <Navigate to="/app" />} />
          <Route path='dashboard/Brokrage-refresh' element={userType === 4 || userType === 5 ? <Brokrageref /> : <Navigate to="/app" />} />
          <Route path='dashboard/forex-previous-valan-trade' element={userType === 4 || userType === 5 ? <Forexvaln /> : <Navigate to="/app" />} />
          <Route path='dashboard/Employe-Listing' element={userType === 4 ? <Employeelisting /> : <Navigate to="/app" />} />
          <Route path='dashboard/add-employee' element={userType === 4 ? <Addemployee /> : <Navigate to="/app" />} />


          <Route path='dashboard/trade-edit-delete-log-old' element={(userType === 4 || userType === 5) && (isForex || isStock) ? <Tradeditdeleteold /> : <Navigate to="/app" />} />
          <Route path='dashboard/cash-edit-delete-log' element={userType === 4 || userType === 5 ? <Casheditdeletelog /> : <Navigate to="/app" />} />
          <Route path='dashboard/valan' element={userType === 4 || userType === 5 ? <Valan /> : <Navigate to="/app" />} />


          {/* <Route path='dashboard/Cash-Entry' element={userType !== 2 && userType !== 1 ? <Cashentry /> : <Navigate to="/app" />} /> */}
          <Route path='dashboard/Cash-Entry' element={userType !== 2 && userType !== 1 ? <JV /> : <Navigate to="/app" />} />
          <Route path='dashboard/Trial-balance' element={userType === 3 || userType === 4 || userType === 5 ? <Trialbalance /> : <Navigate to="/app" />} />
          <Route path='dashboard/Trial-balance' element={userType === 4 || userType === 5 ? <Trialbalance /> : <Navigate to="/app" />} />
          <Route path='dashboard/Order-Limit' element={<Orderlimit />} />
          <Route path='dashboard/Blocked-Allowed-Script' element={(isForex || isStock) ? <Blockedallowedscript /> : <Navigate to="/app" />} />
          <Route path='dashboard/Master-QTY-Setting' element={userType === 3 ? <Masterqtysetting /> : <Navigate to="/app" />} />
          <Route path='dashboard/Script-Wise-Lot-setting' element={userType !== 3 ? <Scriptwiselot /> : <Navigate to="/app" />} />
          <Route path='dashboard/Add-Script' element={userType !== 3 ? <Addscript /> : <Navigate to="/app" />} />
          <Route path='dashboard/Add-Expiry' element={userType !== 3 ? <Addepiry /> : <Navigate to="/app" />} />
          <Route path='dashboard/Edit-Expiry' element={userType !== 3 ? <Editexpiry /> : <Navigate to="/app" />} />
          <Route path='dashboard/Edit-Script' element={userType !== 3 ? <Editscript /> : <Navigate to="/app" />} />
          <Route path='dashboard/CNBD-Awaaz' element={userType !== 3 ? <Cnbdawaz /> : <Navigate to="/app" />} />
          <Route path='dashboard/Stop-future-trading' element={userType === 4 && (isForex || isStock) ? <Stopfuturetrading /> : <Navigate to="/app" />} />
          <Route path='dashboard/Split-script' element={userType !== 3 && (isForex || isStock) ? <Splitscript /> : <Navigate to="/app" />} />
          <Route path='dashboard/NSEOPT-management' element={userType !== 3 ? <Nseoptmanagement /> : <Navigate to="/app" />} />
          <Route path='dashboard/MARQUEE' element={userType === 4 ? <Marquee /> : <Navigate to="/app" />} />
          <Route path='dashboard/Expiry-Validation' element={userType !== 3 ? <Expiryvalidation /> : <Navigate to="/app" />} />
          <Route path='dashboard/Notifcation' element={userType === 4 || userType === 5 ? <Notificationn /> : <Navigate to="/app" />} />
          <Route path='dashboard/Time-Setting' element={userType !== 3 ? <Timesetting /> : <Navigate to="/app" />} />
          <Route path='dashboard/level-import' element={userType !== 3 ? <Levelimport /> : <Navigate to="/app" />} />

        </Route>

        <Route path="dashboard/cryptocurrency" element={<CryptoDashboard />} />
        <Route path="dashboard/sales-marketing" element={<CrmDashboard />} />
        { /* Widgets */}
        <Route path="widgets/infographics" element={<Infographics />} />
        <Route path="widgets/status" element={<Status />} />
        <Route path="widgets/mini-apps" element={<MiniApps />} />
        <Route path="widgets/analytics" element={<Analytics />} />
        <Route path="widgets/info-updates" element={<InfoUpdates />} />
        { /* Layout */}
        <Route path="layouts" element={<Parent />} />
        <Route path="layouts/grid" element={<Grid />} />
        <Route path="layouts/app-layout" element={<AppLayout />} />
        <Route path="layouts/responsive" element={<Responsive />} />
        { /* Table */}
        <Route path="tables" element={<Parent />} />
        <Route path="tables/basic-table" element={<SimpleTable />} />
        <Route path="tables/data-table" element={<AdvancedTable />} />
        <Route path="tables/table-playground" element={<TablePlayground />} />
        <Route path="tables/tree-table" element={<TreeTable />} />
        <Route path="tables/editable-cell" element={<CRUDTable />} />
        { /* Form & Button */}
        <Route path="forms" element={<Parent />} />
        <Route path="forms/formik-form" element={<FormikForm />} />
        <Route path="forms/date-time-picker" element={<DateTimePicker />} />
        <Route path="forms/checkbox-radio" element={<CheckboxRadio />} />
        <Route path="forms/switches" element={<Switches />} />
        <Route path="forms/selectbox" element={<Selectbox />} />
        <Route path="forms/ratting" element={<Rating />} />
        <Route path="forms/slider-range" element={<SliderRange />} />
        <Route path="forms/buttons" element={<Buttons />} />
        <Route path="forms/toggle-button" element={<ToggleButton />} />
        <Route path="forms/dial-button" element={<DialButton />} />
        <Route path="forms/textfields" element={<Textbox />} />
        <Route path="forms/autocomplete" element={<Autocomplete />} />
        <Route path="forms/upload" element={<Upload />} />
        <Route path="forms/wysiwyg-editor" element={<TextEditor />} />
        { /* Ui Components */}
        <Route exact path="ui" element={<Parent />} />
        <Route path="ui/avatars" element={<Avatars />} />
        <Route path="ui/accordion" element={<Accordion />} />
        <Route path="ui/badges" element={<Badges />} />
        <Route path="ui/list" element={<List />} />
        <Route path="ui/popover-tooltip" element={<PopoverTooltip />} />
        <Route path="ui/snackbar" element={<Snackbar />} />
        <Route path="ui/typography" element={<Typography />} />
        <Route path="ui/tabs" element={<Tabs />} />
        <Route path="ui/card-papper" element={<Cards />} />
        <Route path="ui/image-grid" element={<ImageGrid />} />
        <Route path="ui/progress" element={<Progress />} />
        <Route path="ui/dialog-modal" element={<DialogModal />} />
        <Route path="ui/steppers" element={<Steppers />} />
        <Route path="ui/paginations" element={<Paginations />} />
        <Route path="ui/drawer-menu" element={<DrawerMenu />} />
        <Route path="ui/breadcrumbs" element={<Breadcrumbs />} />
        <Route path="ui/icons" element={<Icons />} />
        <Route path="ui/ionicons" element={<IonIcons />} />
        <Route path="ui/slider-carousel" element={<SliderCarousel />} />
        <Route path="ui/tags" element={<Tags />} />
        <Route path="ui/dividers" element={<Dividers />} />
        { /* Chart */}
        <Route path="charts" element={<Parent />} />
        <Route path="charts/line-charts" element={<LineCharts />} />
        <Route path="charts/bar-charts" element={<BarCharts />} />
        <Route path="charts/area-charts" element={<AreaCharts />} />
        <Route path="charts/pie-charts" element={<PieCharts />} />
        <Route path="charts/radar-charts" element={<RadarCharts />} />
        <Route path="charts/scatter-charts" element={<ScatterCharts />} />
        <Route path="charts/compossed-chart" element={<CompossedCharts />} />
        <Route path="charts/doughnut-pie-charts" element={<DoughnutCharts />} />
        <Route path="charts/bar-direction-charts" element={<BarDirection />} />
        <Route path="charts/line-scatter-charts" element={<LineScatterChart />} />
        <Route path="charts/area-filled-charts" element={<AreaFilledChart />} />
        <Route path="charts/radar-polar-chart" element={<RadarPolarCharts />} />
        { /* Sample Apps */}
        <Route path="pages/contact" element={<Contact />} />
        <Route path="pages/email" element={<Email />} />
        <Route path="pages/timeline" element={<Timeline />} />
        <Route path="pages/chat" element={<Chat />} />
        <Route path="pages/ecommerce" element={<Ecommerce />} />
        <Route path="pages/product-detail" element={<ProductPage />} />
        <Route path="pages/checkout" element={<CheckoutPage />} />
        <Route path="pages/invoice" element={<Invoice />} />
        <Route path="pages/taskboard" element={<TaskBoard />} />
        <Route path="pages/calendar" element={<Calendar />} />
        { /* Pages */}
        <Route path="pages" element={<Parent />} />
        <Route path="pages/user-profile" element={<Profile />} />
        <Route path="pages/blank-page" element={<BlankPage />} />
        <Route path="blank-single" element={<BlankPage />} />
        <Route path="pages/photo-gallery" element={<Photos />} />
        <Route path="pages/pricing" element={<Pricing />} />
        <Route path="pages/not-found" element={<NotFound />} />
        <Route path="pages/error" element={<Error />} />
        <Route path="pages/settings" element={<Settings />} />
        <Route path="pages/help-support" element={<HelpSupport />} />
        { /* Map */}
        <Route path="maps" element={<Parent />} />
        <Route path="maps/map-marker" element={<MapMarker />} />
        <Route path="maps/map-direction" element={<MapDirection />} />
        <Route path="maps/map-searchbox" element={<SearchMap />} />
        <Route path="maps/map-traffic" element={<TrafficIndicator />} />
        <Route path="maps/street-view" element={<StreetViewMap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Dashboard>
  );
}

Application.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Application;
