console.log("Menu.js enteredddddddddddddddd")
const menu = [
  {
    key: 'Dashboard',
    name: 'Dashboard',
    link: '/app',
    icon: 'grid-outline'
  },
  {
    key: 'crypto',
    name: 'Watchlist',
    link: '/app/dashboard/watchlist',
    icon: 'list-outline'
  },
  {
    key: 'ledger',
    name: 'Ledger',
    link: '/app/ledger',
    icon: 'time-outline'
  },
  {
    key: 'editDeleteLogs',
    name: 'Edit Delete',
    link: '/app/dashboard/edit-Delete-Logs',
    icon: 'create-outline'
  },
  {
    key: 'orderBook',
    name: 'Order Book',
    link: '/app/dashboard/order-Book',
    icon: 'receipt-outline'
  },
  {
    key: 'positions',
    name: 'Positions',
    link: '/app/dashboard/positions',
    icon: 'cube-outline'
  },
  {
    key: 'Banned Scripts',
    name: 'Banned Scripts',
    link: '/app/dashboard/Banned-scripts',
    icon: 'ban-outline'
  },
  {
    key: 'Max QTY details',
    name: 'Max QTY details',
    link: '/app/dashboard/max-qty-details',
    icon: 'reader-outline'
  },
  {
    key: 'Rejection Logs',
    name: 'Rejection Logs',
    link: '/app/dashboard/rejection-logs',
    icon: 'close-circle-outline'
  },
  {
    key: 'login2',
    name: 'Login',
    link: '/login',
    icon: 'person-outline'
  },
  {
    key: 'crypto',
    name: 'StockDetailMobile',
    link: '/app/dashboard/stock-details',
    icon: 'ion-ios-medal-outline',
    hideInSidebar: true,
  },
];


const rawData = JSON.parse(sessionStorage.getItem("data"));
const userType = parseInt(rawData?.user_type, 10);

const notificationData = JSON.parse(sessionStorage.getItem("notification"));
console.log('### notificationData', notificationData);
const isStock = notificationData?.isStock;
console.log("isStock", isStock);
const isForex = notificationData?.isForex;
console.log("isForex", isForex);

if (isStock) {
  menu.push({
    key: 'Treding',
    name: 'Treding',
    // link: '/app/dashboard/Banned-scripts',
    icon: 'ban-outline'
  })
}
if (isForex) {
  menu.push({
    key: 'Forex comex',
    name: 'Forex comex',
    // link: '/app/dashboard/Banned-scripts',
    icon: 'ban-outline'
  })
}


if (userType === 1) {
  menu.push({
    key: 'Banned Scripts',
    name: 'Banned Scripts',
    link: '/app/dashboard/Banned-scripts',
    icon: 'ban-outline'
  })
}

module.exports = menu;