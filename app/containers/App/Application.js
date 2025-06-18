import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { Routes, Route } from 'react-router-dom';
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
  TrafficIndicator, StreetViewMap, NotFound
} from '../pageListAsync';

function Application(props) {
  const { history } = props;
  const changeMode = useContext(ThemeContext);
  return (
    <Dashboard history={history} changeMode={changeMode}>
      <Routes>
        { /* Home */ }
        <Route path="/" element={<PersonalDashboard/>} />
        <Route path="dashboard/sales-marketing" element={<CrmDashboard/>} />
        <Route path="dashboard/cryptocurrency" element={<CryptoDashboard/>} />
        { /* Widgets */ }
        <Route path="widgets/infographics" element={<Infographics/>} />
        <Route path="widgets/status" element={<Status/>} />
        <Route path="widgets/mini-apps" element={<MiniApps/>} />
        <Route path="widgets/analytics" element={<Analytics/>} />
        <Route path="widgets/info-updates" element={<InfoUpdates/>} />
        { /* Layout */ }
        <Route path="layouts" element={<Parent/>} />
        <Route path="layouts/grid" element={<Grid/>} />
        <Route path="layouts/app-layout" element={<AppLayout/>} />
        <Route path="layouts/responsive" element={<Responsive/>} />
        { /* Table */ }
        <Route path="tables" element={<Parent/>} />
        <Route path="tables/basic-table" element={<SimpleTable/>} />
        <Route path="tables/data-table" element={<AdvancedTable/>} />
        <Route path="tables/table-playground" element={<TablePlayground/>} />
        <Route path="tables/tree-table" element={<TreeTable/>} />
        <Route path="tables/editable-cell" element={<CRUDTable/>} />
        { /* Form & Button */ }
        <Route path="forms" element={<Parent/>} />
        <Route path="forms/formik-form" element={<FormikForm/>} />
        <Route path="forms/date-time-picker" element={<DateTimePicker/>} />
        <Route path="forms/checkbox-radio" element={<CheckboxRadio/>} />
        <Route path="forms/switches" element={<Switches/>} />
        <Route path="forms/selectbox" element={<Selectbox/>} />
        <Route path="forms/ratting" element={<Rating/>} />
        <Route path="forms/slider-range" element={<SliderRange/>} />
        <Route path="forms/buttons" element={<Buttons/>} />
        <Route path="forms/toggle-button" element={<ToggleButton/>} />
        <Route path="forms/dial-button" element={<DialButton/>} />
        <Route path="forms/textfields" element={<Textbox/>} />
        <Route path="forms/autocomplete" element={<Autocomplete/>} />
        <Route path="forms/upload" element={<Upload/>} />
        <Route path="forms/wysiwyg-editor" element={<TextEditor/>} />
        { /* Ui Components */}
        <Route exact path="ui" element={<Parent/>} />
        <Route path="ui/avatars" element={<Avatars/>} />
        <Route path="ui/accordion" element={<Accordion/>} />
        <Route path="ui/badges" element={<Badges/>} />
        <Route path="ui/list" element={<List/>} />
        <Route path="ui/popover-tooltip" element={<PopoverTooltip/>} />
        <Route path="ui/snackbar" element={<Snackbar/>} />
        <Route path="ui/typography" element={<Typography/>} />
        <Route path="ui/tabs" element={<Tabs/>} />
        <Route path="ui/card-papper" element={<Cards/>} />
        <Route path="ui/image-grid" element={<ImageGrid/>} />
        <Route path="ui/progress" element={<Progress/>} />
        <Route path="ui/dialog-modal" element={<DialogModal/>} />
        <Route path="ui/steppers" element={<Steppers/>} />
        <Route path="ui/paginations" element={<Paginations/>} />
        <Route path="ui/drawer-menu" element={<DrawerMenu/>} />
        <Route path="ui/breadcrumbs" element={<Breadcrumbs/>} />
        <Route path="ui/icons" element={<Icons/>} />
        <Route path="ui/ionicons" element={<IonIcons/>} />
        <Route path="ui/slider-carousel" element={<SliderCarousel/>} />
        <Route path="ui/tags" element={<Tags/>} />
        <Route path="ui/dividers" element={<Dividers/>} />
        { /* Chart */ }
        <Route path="charts" element={<Parent/>} />
        <Route path="charts/line-charts" element={<LineCharts/>} />
        <Route path="charts/bar-charts" element={<BarCharts/>} />
        <Route path="charts/area-charts" element={<AreaCharts/>} />
        <Route path="charts/pie-charts" element={<PieCharts/>} />
        <Route path="charts/radar-charts" element={<RadarCharts/>} />
        <Route path="charts/scatter-charts" element={<ScatterCharts/>} />
        <Route path="charts/compossed-chart" element={<CompossedCharts/>} />
        <Route path="charts/doughnut-pie-charts" element={<DoughnutCharts/>} />
        <Route path="charts/bar-direction-charts" element={<BarDirection/>} />
        <Route path="charts/line-scatter-charts" element={<LineScatterChart/>} />
        <Route path="charts/area-filled-charts" element={<AreaFilledChart/>} />
        <Route path="charts/radar-polar-chart" element={<RadarPolarCharts/>} />
        { /* Sample Apps */ }
        <Route path="pages/contact" element={<Contact/>} />
        <Route path="pages/email" element={<Email/>} />
        <Route path="pages/timeline" element={<Timeline/>} />
        <Route path="pages/chat" element={<Chat/>} />
        <Route path="pages/ecommerce" element={<Ecommerce/>} />
        <Route path="pages/product-detail" element={<ProductPage/>} />
        <Route path="pages/checkout" element={<CheckoutPage/>} />
        <Route path="pages/invoice" element={<Invoice/>} />
        <Route path="pages/taskboard" element={<TaskBoard/>} />
        <Route path="pages/calendar" element={<Calendar/>} />
        { /* Pages */ }
        <Route path="pages" element={<Parent/>} />
        <Route path="pages/user-profile" element={<Profile/>} />
        <Route path="pages/blank-page" element={<BlankPage/>} />
        <Route path="blank-single" element={<BlankPage/>} />
        <Route path="pages/photo-gallery" element={<Photos/>} />
        <Route path="pages/pricing" element={<Pricing/>} />
        <Route path="pages/not-found" element={<NotFound/>} />
        <Route path="pages/error" element={<Error/>} />
        <Route path="pages/settings" element={<Settings/>} />
        <Route path="pages/help-support" element={<HelpSupport/>} />
        { /* Map */ }
        <Route path="maps" element={<Parent/>} />
        <Route path="maps/map-marker" element={<MapMarker/>} />
        <Route path="maps/map-direction" element={<MapDirection/>} />
        <Route path="maps/map-searchbox" element={<SearchMap/>} />
        <Route path="maps/map-traffic" element={<TrafficIndicator/>} />
        <Route path="maps/street-view" element={<StreetViewMap/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Dashboard>
  );
}

Application.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Application;
