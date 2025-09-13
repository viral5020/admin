console.log("Menu.js running...");

// const userdata = {};
// const notifcationData = {};

// const isForex = false;
// const isStock = false;
// const userType = null;

// const interval = setInterval(() => {
//   const newData = JSON.parse(sessionStorage.getItem("notification"));
//   if (newData) {
//     clearInterval(interval);
//     notifcationData = newData;
//     console.log('>> notifcationData', notifcationData);
//     isStock = notifcationData?.isStock;
//     isForex = notifcationData?.isForex;
//     console.log('>> isStock, isForex', isStock, isForex);
//   }
// }, 1000); // poll every second (or adjust as needed)


// const userInterval = setInterval(() => {
//   const newData = JSON.parse(sessionStorage.getItem("data"));
//   if (newData) {
//     clearInterval(userInterval);
//     userdata = newData;
//     console.log('>> userdata', userdata);
//     userType = parseInt(userdata?.user_type, 10);
//     console.log('>> userType', userType);
//   }
// }, 1000); // poll every second (or adjust as needed)




export function getSibarContent() {
  const rawData = sessionStorage.getItem("data");
  let userType = null;

  if (rawData) {
    try {
      const parsedData = JSON.parse(rawData);
      userType = parseInt(parsedData.user_type, 10);
    } catch (err) {
      console.error("Error parsing session storage data:", err);
    }
  } else {
    console.warn("No sessionStorage data found for key 'data'");
  }

  console.log('userType:', userType);


  const notificationData = JSON.parse(sessionStorage.getItem("notification"));
  const isStock = notificationData?.isStock;
  const isForex = notificationData?.isForex;

  const menu = []

  if (userType === 1) {
    menu.push({
      key: 'Dashboard',
      name: 'Dashboard',
      link: '/app',
      icon: 'grid-outline'
    });
  }

  if (userType === 3 || userType === 4) {
    menu.push({
      key: 'Master Dashboard',
      name: 'Master Dashboard',
      link: '/app/dashboard/Master-Dashboard',
      icon: 'grid-outline'
    });
  }

  // ---------- Stock Trading Menu ----------
  if (isStock) {
    menu.push({
      key: 'stock_trading',
      name: 'Stock Trading',
      // icon: 'ion-ios-briefcase-outline',
      child: [
        {
          key: 'crypto',
          name: 'Watchlist',
          link: '/app/dashboard/watchlist',
          icon: 'list-outline'
        },
        {
          key: 'favorites',
          name: 'Favorites',
          link: '/app/dashboard/favorite-list',
          icon: 'star-outline'
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
            key: 'previous',
            name: 'previous valan trade',
            link: '/app/dashboard/previous-valan-trade',
            icon: 'cube-outline'
          }]
          : []),

        ...(userType !== 2
          ? [{
            key: 'editDeleteLogs',
            name: 'Banned/Blocked script',
            link: '/app/dashboard/Banned-Blocked-Scripts',
            icon: 'create-outline'
          }]
          : []),

        ...(userType !== 1 && userType !== 2
          ? [{
            key: 'Max QTY details',
            name: 'margin managemnet',
            link: '/app/dashboard/Margin-management',
            icon: 'book-outline'
          }]
          : []),

        ...(userType === 4
          ? [{
            key: 'Max QTY details',
            name: 'manual trade',
            link: '/app/dashboard/manual-trade',
            icon: 'reader-outline'
          }]
          : []),
        // 7 cmex expire 
        ...(userType !== 1
          ? [{
            key: 'Summary report',
            name: 'summary report',
            link: '/app/dashboard/summary-report',
            icon: 'trending-up'
          }]
          : []),

        ...(userType === 4
          ? [{
            key: 'Max QTY details',
            name: 'self p&l',
            link: '/app/dashboard/Self-P&L',
            icon: 'reader-outline'
          }]
          : []),

        ...(userType === 4 || userType === 5
          ? [{
            key: 'Brokrage refresh',
            name: 'Brokrage refresh',
            link: '/app/dashboard/Brokrage-refresh',
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
      // icon: 'ion-ios-swap-outline',
      child: [
        {
          key: 'crypto',
          name: 'Watchlist',
          link: '/app/dashboard/forex-watchlist',
          icon: 'list-outline'
        },
        {
          key: 'favorites',
          name: 'Favorites',
          link: '/app/dashboard/forex-favorite-list',
          icon: 'star-outline'
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
            link: '/app/dashboard/forex-previous-valan-trade',
            icon: 'cube-outline'
          }]
          : []),

        ...(userType !== 1 && userType !== 2
          ? [{
            key: 'Max QTY details',
            name: 'margin managemnet',
            link: '/app/dashboard/forex-Margin-management',
            icon: 'book-outline'
          }]
          : []),

        ...(userType !== 1
          ? [{
            key: 'Max QTY details',
            name: 'summary report',
            link: '/app/dashboard/forex-Summary-report',
            icon: 'trending-up'
          }]
          : []),

      ]
    });
  }

  // ---------- User Menu ----------

  if (userType !== 1) {
    menu.push({
      key: 'user',
      name: 'User',
      // icon: 'ion-ios-swap-outline',
      child: [
        ...(userType === 3 || userType === 4
          ? [{
            key: 'User Profile',
            name: 'User Profile',
            link: '/app/dashboard/User-Profile',
            icon: 'people-outline'
          }]
          : []),
        {
          key: 'user_listing',
          name: 'User Listing',
          link: '/app/dashboard/User-listing',
          icon: 'list-outline'
        },
        ...(userType !== 2 && userType !== 1
          ? [{
            key: 'master_listing',
            name: 'Master Listing',
            link: '/app/dashboard/Master-Listing',
            icon: 'receipt-outline'
          }]
          : []),

        ...(userType !== 2 && userType !== 1
          ? [{
            key: 'forexpositions',
            name: 'Broker Listing',
            link: '/app/dashboard/Broker-Listing',
            icon: 'cube-outline'
          }]
          : []),

        ...(userType !== 2 && userType !== 1
          ? [{
            key: 'add_account',
            name: 'Add Account',
            link: '/app/dashboard/Add-Account',
            icon: 'add-circle-outline'
          }]
          : []),
        ...(userType === 4
          ? [{
            key: 'employee_listing',
            name: 'Employe Listing',
            link: '/app/dashboard/Employe-Listing',
            icon: 'cube-outline'
          }]
          : []),

        ...(userType === 4
          ? [{
            key: 'add_employee',
            name: 'Add Employee',
            link: '/app/dashboard/add-employee',
            icon: 'reader-outline'
          }]
          : []),
      ]
    });
  }

  // Utility Menu

  if (userType !== 2) {
    menu.push({
      key: 'utility',
      name: 'Utility',
      // icon: 'ion-ios-swap-outline',
      child: [
        ...(userType !== 1 && (isForex || isStock)
          ? [{
            key: 'bulk-trading',
            name: 'Bulk trading',
            link: '/app/dashboard/bulk-trading',
            icon: 'receipt-outline'
          }]
          : []),
        ...(userType !== 2 && userType !== 1
          ? [{
            key: 'bill-filter',
            name: 'Bill filter',
            link: '/app/dashboard/bill-filter',
            icon: 'receipt-outline'
          }]
          : []),
        ...(userType !== 2 && (isForex || isStock)
          ? [{
            key: 'trade-edit-delete-log',
            name: 'Trade edit delete log',
            link: '/app/dashboard/trade-edit-delete-log',
            icon: 'receipt-outline'
          }]
          : []),
        ...((userType === 4 || userType === 5) && (isForex || isStock)
          ? [{
            key: 'trade-edit-delete-log-old',
            name: 'Trade edit delete log old',
            link: '/app/dashboard/trade-edit-delete-log-old',
            icon: 'receipt-outline'
          }]
          : []),
        ...(userType === 3 || userType === 4 || userType === 5
          ? [{
            key: 'user-edit-log',
            name: 'User edit log',
            link: '/app/dashboard/user-edit-log',
            icon: 'receipt-outline'
          }]
          : []),
        ...(userType !== 2 && userType !== 1
          ? [{
            key: 'ip-address-log',
            name: 'IP address log',
            link: '/app/dashboard/ip-address-log',
            icon: 'receipt-outline'
          }]
          : []),
        ...(userType === 4 && userType === 5
          ? [{
            key: 'admin-login-list',
            name: 'Admin login list',
            // link: '/app/dashboard/admin-login-list',
            icon: 'receipt-outline'
          }]
          : []),
        ...(userType === 4 || userType === 5
          ? [{
            key: 'cash-edit-delete-log',
            name: 'Cash edit delete log',
            link: '/app/dashboard/cash-edit-delete-log',
            icon: 'receipt-outline'
          }]
          : []),
        ...((userType === 3 || userType === 4 || userType === 5) && (isForex || isStock)
          ? [{
            key: 'auto-square-up-log',
            name: 'Auto Square Up log',
            link: '/app/dashboard/auto-square-up-log',
            icon: 'receipt-outline'
          }]
          : []),
        ...((userType === 3 || userType === 4 || userType === 5) && (isForex || isStock)
          ? [{
            key: 'cross-trade-log',
            name: 'Cross trade log',
            link: '/app/dashboard/cross-trade-log',
            icon: 'receipt-outline'
          }]
          : []),
        ...(userType !== 2 && (isForex || isStock)
          ? [{
            key: 'Rejection Logs',
            name: 'Rejection Logs',
            link: '/app/dashboard/rejection-logs',
            icon: 'close-circle-outline'
          }]
          : []),
        ...(userType === 4 || userType === 5
          ? [{
            key: 'valan',
            name: 'Valan',
            link: '/app/dashboard/valan',
            icon: 'receipt-outline'
          }]
          : []),
        // ...(userType !== 2 && userType !== 1
        //   ? [{
        //     key: 'ledger',
        //     name: 'Cash Ledger',
        //     link: '/app/Cash-ledger',
        //     icon: 'time-outline'
        //   }]
        //   : []),
      ]
    });
  }

  if (userType === 1 || userType === 3 || userType === 2 || userType === 4 || userType === 5) {
    menu.push({
      key: 'Accounts',
      name: 'Accounts',
      // icon: 'ion-ios-swap-outline',
      child: [
        ...(userType !== 2 && userType !== 1
          ? [{
            key: 'ledger',
            name: 'Cash Ledger',
            link: '/app/Cash-ledger',
            icon: 'time-outline'
          }]
          : []),

        // ...(userType !== 2 && userType !== 1
        //   ? [{
        //     key: 'master_listing',
        //     name: 'Cash Entry',
        //     link: '/app/dashboard/Cash-Entry',
        //     icon: 'receipt-outline'
        //   }]
        //   : []),

        ...(userType !== 2 && userType !== 1
          ? [{
            key: 'forexpositions',
            name: 'Cash Entry',
            link: '/app/dashboard/Cash-Entry',
            icon: 'cube-outline'
          }]
          : []),

        ...(userType === 3
          ? [{
            key: 'add_account',
            name: 'Trial Balance',
            link: '/app/dashboard/Trial-balance',
            icon: 'add-circle-outline'
          }]
          : []),

        ...(userType === 4 || userType === 5
          ? [{
            key: 'add_account',
            name: 'Trial Balance',
            icon: 'add-circle-outline',
            link: (() => {
              const dataStored = JSON.parse(sessionStorage.getItem("data"));
              if (!dataStored) return "#";

              const BASE_URL = "http://128.199.126.171/~goldorg/pdf/trial_balance";
              const url = new URL(BASE_URL);
              url.searchParams.set("isAll", "1");
              url.searchParams.set("is", "1");
              url.searchParams.set("k", dataStored.auth_key);
              url.searchParams.set("lui", dataStored.user_id);

              return url.toString();
            })(),

            onClick: (e) => {
              // ensures opening in new tab if link handling fails
              const link = e.currentTarget.getAttribute('href');
              window.open(link, '_blank');
            }
          }]
          : []),

        ...(userType === 1 || userType === 2
          ? [{
            key: 'ledger',
            name: 'Ledger',
            link: '/app/ledger',
            icon: 'time-outline'
          }]
          : []),
        ...(userType === 3 || userType === 4
          ? [{
            key: 'ledger',
            name: 'Ledger Report',
            link: '/app/ledger-report',
            icon: 'time-outline'
          }]
          : []),
      ]
    });
  }

  if ((userType !== 1 && userType !== 2) && (isStock || isForex)) {
    menu.push({
      key: 'Setting',
      name: 'Setting',
      child: [
        // visible if userType !== 3
        ...(userType !== 3 ? [{
          key: 'ledger',
          name: 'Script Wise Lot Setting',
          link: '/app/dashboard/Script-Wise-Lot-Setting',
          icon: 'time-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'Add Script',
          name: 'Add Script',
          link: '/app/dashboard/Add-Script',
          icon: 'receipt-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'Add Expiry',
          name: 'Add Expiry',
          link: '/app/dashboard/Add-Expiry',
          icon: 'cube-outline'
        }] : []),

        // only userType === 3
        ...(userType !== 3 ? [{
          key: 'Edit Expiry',
          name: 'Edit Expiry',
          link: '/app/dashboard/Edit-Expiry',
          icon: 'add-circle-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'Edit Script',
          name: 'Edit Script',
          link: '/app/dashboard/Edit-Script',
          icon: 'time-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'Banned Scripts',
          name: 'Banned Scripts',
          link: '/app/dashboard/Banned-scripts',
          icon: 'ban-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'CNBD Awaaz',
          name: 'CNBD Awaaz',
          icon: 'time-outline'
        }] : []),


        {
          key: 'order limit',
          name: 'order limit',
          link: '/app/dashboard/Order-Limit',
          icon: 'time-outline'
        },

        // visible if forex/stock enabled
        ...((isForex || isStock) ? [{
          key: 'block/allowed',
          name: 'block/allowed  Script',
          link: '/app/dashboard/Blocked-Allowed-Script',
          icon: 'time-outline'
        }] : []),

        // only userType === 4
        ...(userType === 4 && (isForex || isStock) ? [{
          key: 'stop future trading',
          name: 'stop future trading',
          icon: 'time-outline'
        }] : []),

        ...(userType !== 3 && (isForex || isStock) ? [{
          key: 'split script',
          name: 'split script',
          icon: 'time-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'NSEOPT management',
          name: 'NSEOPT management',
          icon: 'time-outline'
        }] : []),

        ...(userType === 4 ? [{
          key: 'MARQUEE',
          name: 'MARQUEE',
          icon: 'time-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'expiry validation',
          name: 'expiry validation',
          icon: 'time-outline'
        }] : []),

        ...(userType === 4 || userType === 5 ? [{
          key: 'notifcation',
          name: 'notifcation',
          icon: 'time-outline'
        }] : []),

        ...(userType === 4 || userType === 5 ? [{
          key: 'level import',
          name: 'level import',
          icon: 'time-outline'
        }] : []),

        ...(userType === 3 ? [{
          key: 'master qty setting',
          name: 'master qty setting',
          link: '/app/dashboard/Master-QTY-Setting',
          icon: 'time-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'time setting',
          name: 'time setting',
          icon: 'time-outline'
        }] : []),

        ...(userType !== 2 && userType !== 4 && userType !== 5
          ? [{
            key: 'Max QTY details',
            name: 'Max QTY details',
            link: '/app/dashboard/max-qty-details',
            icon: 'reader-outline'
          }]
          : []),
      ]
    });
  }




  // bulk tradind 1 na ho to dekhega and is stock or is forex
  // bill filter 1 and 2 nai to dikhega
  // trade edit deldte log is forex or is stock and user type 2 na ho to
  // trade edit deldte log old is forex or is stock and 4 or 5
  // user edit log 3    4   or 5 ho to dikhega
  // IP address log 1 and 2 na ho to

  // Admin login list 4 or5 ho to
  // cash edit delet log  3 4 or5 ho to
  // auto square up log is forex or is stock and 3 4 or 5
  // cross trade log is forex or is stock and 3 4 or 5
  // rejection log is forex or is stock and 2 an ho to
  // valan 4 or 5 ho to dihega

  // menu.push({
  //   key: 'editDeleteLogs',
  //   name: 'Edit Delete',
  //   link: '/app/dashboard/edit-Delete-Logs',
  //   icon: 'create-outline'
  // });

  // userType !== 2 && menu.push({
  //   key: 'editDeleteLogs',
  //   name: 'Banned/Blocked script',
  //   link: '/app/dashboard/Banned-Blocked-Scripts',
  //   icon: 'create-outline'
  // });






  // module.exports = menu;

  // console.log('menu', menu);
  return menu;
}

const menu = [{
  key: 'editDeleteLogs',
  name: 'Banned/Blocked script',
  link: '/app/dashboard/Banned-Blocked-Scripts',
  icon: 'create-outline'
}, {
  key: 'editDeleteLogs',
  name: 'Banned/Blocked script',
  link: '/app/dashboard/Banned-Blocked-Scripts',
  icon: 'create-outline'
}]

export default menu;