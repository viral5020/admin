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
  const userType = parseInt(auth.userData?.user_type, 10);
  const isEmployeeLogin = auth.userData?.isEmployeeLogin;
  const emp_permission = auth.emp_permission;


  return (
    <Dashboard history={history} changeMode={changeMode}>
      <Routes>

        <Route element={<ProtectedRoute />}>

          {/* -------------------- Dashboard Routes -------------------- */}
          <Route path="/" element={<PersonalDashboard />} />

          {(userType === 3 || userType === 4) && (
            <Route path="dashboard/Master-Dashboard" element={<Masterdashboard />} />
          )}

          {/* -------------------- Stock Trading -------------------- */}
          {isStock && (!isEmployeeLogin || (userType === 4 && isEmployeeLogin && emp_permission?.includes("TRADE"))) && (
            <>
              <Route path="dashboard/watchlist" element={<Watchlist />} />
              <Route path="dashboard/favorite-list" element={<Watchlist />} />
              <Route path="dashboard/order-Book" element={<OrderBook />} />
              <Route path="dashboard/positions" element={<Positions />} />

              {(userType === 4 || userType === 5) && (
                <Route path="dashboard/previous-valan-trade" element={<Previousvalan />} />
              )}
              {userType !== 2 && (
                <Route path="dashboard/Banned-Blocked-Scripts" element={<BannedBlockedScript />} />
              )}
              {userType !== 1 && (
                <Route path="dashboard/summary-report" element={<Summary_report />} />
              )}
              {userType !== 1 && userType !== 2 && (
                <Route path="dashboard/Margin-management" element={<Marginmanagement />} />
              )}
              {userType !== 1 && userType !== 2 && (
                <Route path="dashboard/Banned-Blocked-Scripts" element={<BannedBlockedScript />} />
              )}
              {userType !== 1 && userType !== 2 && (
                <Route path="dashboard/Margin-management" element={<Marginmanagement />} />
              )}
              {userType !== 1 && (
                <Route path="dashboard/summary-report" element={<Summary_report />} />
              )}
              {userType === 4 && (
                <>
                  <Route path="dashboard/manual-trade" element={<Manualtrade />} />
                  <Route path="dashboard/Self-P&L" element={<Selfpl />} />
                </>
              )}
              {(userType === 4 || userType === 5) && (
                <Route path="dashboard/Brokrage-refresh" element={<Brokrageref />} />
              )}
            </>
          )}

          {/* -------------------- Forex Trading -------------------- */}
          {isForex && (!isEmployeeLogin || (userType === 4 && isEmployeeLogin && emp_permission?.includes("TRADE"))) && (
            <>
              <Route path="dashboard/forex-watchlist" element={<Watchlist />} />
              <Route path="dashboard/forex-favorite-list" element={<Watchlist />} />
              <Route path="dashboard/forex-order" element={<Forex_order />} />
              <Route path="dashboard/forex-position" element={<Forex_position />} />

              {(userType === 4 || userType === 5) && (
                <Route path="dashboard/forex-previous-valan-trade" element={<Forexvaln />} />
              )}
              {userType !== 1 && (
                <Route path="dashboard/forex-Summary-report" element={<Forexsummary />} />
              )}
              {userType !== 1 && userType !== 2 && (
                <Route path="dashboard/forex-Margin-management" element={<Forexmarginmanagement />} />
              )}
            </>
          )}

          {/* -------------------- User Menu -------------------- */}
          {userType !== 1 && (!isEmployeeLogin || (userType === 4 && isEmployeeLogin && emp_permission?.includes("USERS"))) && (
            <>
              {(userType === 3 || userType === 4) && (
                <Route path="dashboard/User-Profile" element={<Userprofile />} />
              )}
              <Route path="dashboard/User-listing" element={<Userlisting />} />
              {(userType !== 2 && userType !== 1) && (
                <>
                  <Route path="dashboard/Master-Listing" element={<MasterList />} />
                  <Route path="dashboard/Broker-Listing" element={<BrokerListing />} />
                  <Route path="dashboard/Add-Account" element={<Addacount />} />
                </>
              )}
              {userType === 4 && (
                <>
                  <Route path="dashboard/Employe-Listing" element={<Employeelisting />} />
                  <Route path="dashboard/add-employee" element={<Addemployee />} />
                </>
              )}
            </>
          )}

          {/* -------------------- Utility Menu -------------------- */}
          {userType !== 2 && (!isEmployeeLogin || (userType === 4 && isEmployeeLogin && emp_permission?.includes("UTILITY"))) && (
            <>
              {userType !== 1 && (isStock || isForex) && (
                <Route path="dashboard/bulk-trading" element={<Bulktrading />} />
              )}
              {(userType !== 2 && userType !== 1) && (
                <>
                  <Route path="dashboard/bill-filter" element={<Billfilter />} />
                  <Route path="dashboard/ip-address-log" element={<Iplistlog />} />
                </>
              )}
              {(userType !== 2 && (isStock || isForex)) && (
                <Route path="dashboard/trade-edit-delete-log" element={<TradeEditDeleteLog />} />
              )}
              {(userType === 4 || userType === 5) && (isStock || isForex) && (
                <Route path="dashboard/trade-edit-delete-log-old" element={<Tradeditdeleteold />} />
              )}
              {(userType === 3 || userType === 4 || userType === 5) && (
                <Route path="dashboard/user-edit-log" element={<Usereditlog />} />
              )}
              {(userType === 3 || userType === 4 || userType === 5) && (isStock || isForex) && (
                <>
                  <Route path="dashboard/auto-square-up-log" element={<Autosquareuplog />} />
                  <Route path="dashboard/cross-trade-log" element={<Crosstradelog />} />
                </>
              )}
              {(userType !== 2 && (isStock || isForex)) && (
                <Route path="dashboard/rejection-logs" element={<RejectionLogs />} />
              )}
              {(userType === 4 || userType === 5) && (
                <>
                  <Route path="dashboard/cash-edit-delete-log" element={<Casheditdeletelog />} />
                  <Route path="dashboard/valan" element={<Valan />} />
                </>
              )}
            </>
          )}

          {/* -------------------- Accounts Menu -------------------- */}
          {(userType === 1 || userType === 2 || userType === 3 || userType === 4 || userType === 5) && (
            <>
              {(userType !== 2 && userType !== 1) && (
                <>
                  <Route path="Cash-ledger" element={<Cashledger />} />
                  <Route path="dashboard/Cash-Entry" element={<JV />} />
                </>
              )}
              {(userType === 3 || userType === 4) && (
                <Route path="dashboard/Trial-balance" element={<Trialbalance />} />
              )}
              {(userType === 4 || userType === 5) && (
                <Route path="dashboard/Trial-balance" element={<Trialbalance />} />
              )}
              {(userType === 1 || userType === 2) && (
                <Route path="ledger" element={<Ledger />} />
              )}
              {(userType === 3 || userType === 4) && (
                <Route path="ledger-report" element={<Ledgerreport />} />
              )}
            </>
          )}

          {/* -------------------- Setting Menu -------------------- */}
          {(userType !== 1 && userType !== 2) && (isStock || isForex) &&
            (!isEmployeeLogin || (userType === 4 && isEmployeeLogin && emp_permission?.includes("SETTING"))) && (
              <>
                {userType !== 3 && (
                  <>
                    <Route path="dashboard/Script-Wise-Lot-Setting" element={<Scriptwiselot />} />
                    <Route path="dashboard/Add-Script" element={<Addscript />} />
                    <Route path="dashboard/Add-Expiry" element={<Addepiry />} />
                    <Route path="dashboard/Edit-Expiry" element={<Editexpiry />} />
                    <Route path="dashboard/Edit-Script" element={<Editscript />} />
                    <Route path="dashboard/Banned-scripts" element={<BlockedScripts />} />
                    <Route path="dashboard/CNBD-Awaaz" element={<Cnbdawaz />} />
                    <Route path="dashboard/Order-Limit" element={<Orderlimit />} />
                    <Route path="dashboard/Blocked-Allowed-Script" element={<Blockedallowedscript />} />
                    <Route path="dashboard/Split-script" element={<Splitscript />} />
                    <Route path="dashboard/NSEOPT-management" element={<Nseoptmanagement />} />
                    <Route path="dashboard/Expiry-Validation" element={<Expiryvalidation />} />
                    <Route path="dashboard/Time-Setting" element={<Timesetting />} />
                    <Route path="dashboard/level-import" element={<Levelimport />} />
                  </>
                )}
                {userType === 3 && (
                  <Route path="dashboard/Master-QTY-Setting" element={<Masterqtysetting />} />
                )}
                {(userType === 4 && (isStock || isForex)) && (
                  <Route path="dashboard/Stop-future-trading" element={<Stopfuturetrading />} />
                )}
                {(userType === 4 || userType === 5) && (
                  <>
                    <Route path="dashboard/MARQUEE" element={<Marquee />} />
                    <Route path="dashboard/Notifcation" element={<Notificationn />} />
                  </>
                )}
                {(userType !== 2 && userType !== 4 && userType !== 5) && (
                  <Route path="dashboard/max-qty-details" element={<MaxQTYDetails />} />
                )}
              </>
            )}

        </Route>

        <Route path="*" element={<NotFound />} />






      </Routes>
    </Dashboard>
  );
}

Application.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Application;
