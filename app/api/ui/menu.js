
// {
//   key: 'Dashboard',
//   name: 'Dashboard',
//   link: '/app',
//   icon: 'grid-outline'
// },
// {
//   key: 'crypto',
//   name: 'Watchlist',
//   link: '/app/dashboard/watchlist',
//   icon: 'list-outline'
// },
// {
//   key: 'ledger',
//   name: 'Ledger',
//   link: '/app/ledger',
//   icon: 'time-outline'
// },
// {
//   key: 'editDeleteLogs',
//   name: 'Edit Delete',
//   link: '/app/dashboard/edit-Delete-Logs',
//   icon: 'create-outline'
// },
// {
//   key: 'orderBook',
//   name: 'Order Book',
//   link: '/app/dashboard/order-Book',
//   icon: 'receipt-outline'
// },
// {
//   key: 'positions',
//   name: 'Positions',
//   link: '/app/dashboard/positions',
//   icon: 'cube-outline'
// },
// {
//   key: 'Banned Scripts',
//   name: 'Banned Scripts',
//   link: '/app/dashboard/Banned-scripts',
//   icon: 'ban-outline'
// },
// {
//   key: 'Max QTY details',
//   name: 'Max QTY details',
//   link: '/app/dashboard/max-qty-details',
//   icon: 'reader-outline'
// },
// {
//   key: 'Rejection Logs',
//   name: 'Rejection Logs',
//   link: '/app/dashboard/rejection-logs',
//   icon: 'close-circle-outline'
// },
// {
//   key: 'login2',
//   name: 'Login',
//   link: '/login',
//   icon: 'person-outline'
// },
// {
//   key: 'crypto',
//   name: 'StockDetailMobile',
//   link: '/app/dashboard/stock-details',
//   icon: 'ion-ios-medal-outline',
//   hideInSidebar: true,
// },



const rawData = JSON.parse(sessionStorage.getItem("data"));
const userType = parseInt(rawData?.user_type, 10);

const notificationData = JSON.parse(sessionStorage.getItem("notification"));
const isStock = notificationData?.isStock;
const isForex = notificationData?.isForex;

const menu = []

menu.push({
  key: 'Dashboard',
  name: 'Dashboard',
  link: '/app',
  icon: 'grid-outline'
});

// ---------- Stock Trading Menu ----------
if (isStock) {
  menu.push({
    key: 'stock_trading',
    name: 'Stock Trading',
    icon: 'ion-ios-briefcase-outline',
    child: [
      {
        key: 'crypto',
        name: 'Watchlist',
        link: '/app/dashboard/watchlist',
        icon: 'list-outline'
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

      ...(userType === 4 || userType === 5
        ? [{
          key: 'positions',
          name: 'previous valan trade',
          // link: '/app/dashboard/positions',
          icon: 'cube-outline'
        }]
        : []),

      ...(userType !== 2
        ? [{
          key: 'Banned Scripts',
          name: 'Banned Scripts',
          link: '/app/dashboard/Banned-scripts',
          icon: 'ban-outline'
        }]
        : []),

      ...(userType !== 2 && userType !== 4 && userType !== 5
        ? [{
          key: 'Max QTY details',
          name: 'Max QTY details',
          link: '/app/dashboard/max-qty-details',
          icon: 'reader-outline'
        }]
        : []),

      ...(userType !== 1 && userType !== 2
        ? [{
          key: 'Max QTY details',
          name: 'margin managemnet',
          // link: '/app/dashboard/max-qty-details',
          icon: 'reader-outline'
        }]
        : []),

      ...(userType === 4
        ? [{
          key: 'Max QTY details',
          name: 'manual trade',
          // link: '/app/dashboard/max-qty-details',
          icon: 'reader-outline'
        }]
        : []),
      // 7 cmex expire 
      ...(userType !== 1
        ? [{
          key: 'Summary report',
          name: 'summary report',
          link: '/app/dashboard/summary-report',
          icon: 'reader-outline'
        }]
        : []),

      ...(userType === 4
        ? [{
          key: 'Max QTY details',
          name: 'self p&l',
          // link: '/app/dashboard/max-qty-details',
          icon: 'reader-outline'
        }]
        : []),

      ...(userType === 4 || userType === 5
        ? [{
          key: 'Max QTY details',
          name: 'brokrage refresh',
          // link: '/app/dashboard/max-qty-details',
          icon: 'reader-outline'
        }]
        : []),

    ]
  });
}

// ---------- Forex Menu ----------
if (isForex) {
  menu.push({
    key: 'forex_trading',
    name: 'Forex Trading',
    icon: 'ion-ios-swap-outline',
    child: [
      {
        key: 'crypto',
        name: 'Watchlist',
        link: '/app/dashboard/forex-watchlist',
        icon: 'list-outline'
      },
      {
        key: 'forexOrder Book',
        name: 'Order Book',
        link: '/app/dashboard/forex-order',
        icon: 'receipt-outline'
      },
      {
        key: 'forexpositions',
        name: 'Positions',
        link: '/app/dashboard/forex-position',
        icon: 'cube-outline'
      },
      ...(userType === 4 || userType === 5
        ? [{
          key: 'positions',
          name: 'previous valan trade',
          // link: '/app/dashboard/positions',
          icon: 'cube-outline'
        }]
        : []),

      ...(userType !== 1 && userType !== 2
        ? [{
          key: 'Max QTY details',
          name: 'margin managemnet',
          // link: '/app/dashboard/max-qty-details',
          icon: 'reader-outline'
        }]
        : []),

      ...(userType !== 1
        ? [{
          key: 'Max QTY details',
          name: 'summary report',
          // link: '/app/dashboard/max-qty-details',
          icon: 'reader-outline'
        }]
        : []),

    ]
  });
}

menu.push({
  key: 'ledger',
  name: 'Ledger',
  link: '/app/ledger',
  icon: 'time-outline'
});

menu.push({
  key: 'editDeleteLogs',
  name: 'Edit Delete',
  link: '/app/dashboard/edit-Delete-Logs',
  icon: 'create-outline'
});

menu.push({
  key: 'Rejection Logs',
  name: 'Rejection Logs',
  link: '/app/dashboard/rejection-logs',
  icon: 'close-circle-outline'
});


module.exports = menu;