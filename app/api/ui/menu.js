console.log("Menu.js running...");

export function getSibarContent(authData) {
  // console.log("Entered in getSibarContent()...");
  const { userData, notificationData, emp_permission } = authData;
  // const auth = useSelector((state) => state.auth);

  // const userData = JSON.parse(sessionStorage.getItem("data"));
  const userType = parseInt(userData?.user_type, 10);
  const { isEmployeeLogin } = userData;
  // console.log('userType:', userType);

  // const notificationData = JSON.parse(sessionStorage.getItem("notification"));
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

  // console.log('isStock', isStock);
  // console.log('isEmployeeLogin', isEmployeeLogin);
  // console.log('userType', userType);
  // console.log('emp_permission', emp_permission);
  // console.log('emp_permission?.includes("TRADE")', emp_permission?.includes('TRADE'));

  // ---------- Stock Trading Menu ----------
  if (isStock && (!isEmployeeLogin || (userType == 4 && isEmployeeLogin && emp_permission?.includes('TRADE')))) {
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
            icon: 'documents-outline'
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
            icon: 'calendar-outline'
          }]
          : []),

      ]
    });
  }

  // ---------- Forex Menu ----------
  if (isForex && (!isEmployeeLogin || (userType == 4 && isEmployeeLogin && emp_permission?.includes('TRADE')))) {
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
            icon: 'documents-outline'
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
  if (userType !== 1 && (!isEmployeeLogin || (userType == 4 && isEmployeeLogin && emp_permission?.includes('USERS')))) { // user === 'USERS'
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
            icon: 'id-card-outline'
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
  if (userType !== 2 && (!isEmployeeLogin || (userType == 4 && isEmployeeLogin && emp_permission?.includes('UTILITY')))) {
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
            icon: 'color-filter-outline'
          }]
          : []),
        ...(userType !== 2 && (isForex || isStock)
          ? [{
            key: 'trade-edit-delete-log',
            name: 'Trade edit delete log',
            link: '/app/dashboard/trade-edit-delete-log',
            icon: 'create-outline'
          }]
          : []),
        ...((userType === 4 || userType === 5) && (isForex || isStock)
          ? [{
            key: 'trade-edit-delete-log-old',
            name: 'Trade edit delete log old',
            link: '/app/dashboard/trade-edit-delete-log-old',
            icon: 'create-outline'
          }]
          : []),
        ...(userType === 3 || userType === 4 || userType === 5
          ? [{
            key: 'user-edit-log',
            name: 'User edit log',
            link: '/app/dashboard/user-edit-log',
            icon: 'person-outline'
          }]
          : []),
        ...(userType !== 2 && userType !== 1
          ? [{
            key: 'ip-address-log',
            name: 'IP address log',
            link: '/app/dashboard/ip-address-log',
            icon: 'hardware-chip-outline'
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
            icon: 'cash-outline'
          }]
          : []),
        ...((userType === 3 || userType === 4 || userType === 5) && (isForex || isStock)
          ? [{
            key: 'auto-square-up-log',
            name: 'Auto Square Up log',
            link: '/app/dashboard/auto-square-up-log',
            icon: 'albums-outline'
          }]
          : []),
        ...((userType === 3 || userType === 4 || userType === 5) && (isForex || isStock)
          ? [{
            key: 'cross-trade-log',
            name: 'Cross trade log',
            link: '/app/dashboard/cross-trade-log',
            icon: 'swap-horizontal-outline'
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
            icon: 'wallet-outline'
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
            icon: 'cash-outline'
          }]
          : []),

        ...(userType === 3
          ? [{
            key: 'add_account',
            name: 'Trial Balance',
            link: '/app/dashboard/Trial-balance',
            icon: 'folder-outline'
          }]
          : []),

        ...(userType === 4 || userType === 5
          ? [{
            key: 'add_account',
            name: 'Trial Balance',
            icon: 'folder-outline',
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
            icon: 'clipboard-outline'
          }]
          : []),
      ]
    });
  }

  if (
    (userType !== 1 && userType !== 2) && (isStock || isForex)
    && (!isEmployeeLogin || (userType == 4 && isEmployeeLogin && emp_permission?.includes('SETTING')))
  ) { // && isPermission.include('SETTING') 
    menu.push({
      key: 'Setting',
      name: 'Setting',
      child: [
        // visible if userType !== 3
        ...(userType !== 3 ? [{
          key: 'ledger',
          name: 'Script Wise Lot Setting',
          link: '/app/dashboard/Script-Wise-Lot-Setting',
          icon: 'albums-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'Add Script',
          name: 'Add Script',
          link: '/app/dashboard/Add-Script',
          icon: 'duplicate-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'Add Expiry',
          name: 'Add Expiry',
          link: '/app/dashboard/Add-Expiry',
          icon: 'enter-outline'
        }] : []),

        // only userType === 3
        ...(userType !== 3 ? [{
          key: 'Edit Expiry',
          name: 'Edit Expiry',
          link: '/app/dashboard/Edit-Expiry',
          icon: 'pencil-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'Edit Script',
          name: 'Edit Script',
          link: '/app/dashboard/Edit-Script',
          icon: 'timer-outline'
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
          link: '/app/dashboard/CNBD-Awaaz',
          icon: 'link-outline'
        }] : []),


        {
          key: 'order limit',
          name: 'order limit',
          link: '/app/dashboard/Order-Limit',
          icon: 'clipboard-outline'
        },

        // visible if forex/stock enabled
        ...((isForex || isStock) ? [{
          key: 'block/allowed',
          name: 'Block/allowed  Script',
          link: '/app/dashboard/Blocked-Allowed-Script',
          icon: 'warning-outline'
        }] : []),

        // only userType === 4
        ...(userType === 4 && (isForex || isStock) ? [{
          key: 'stop future trading',
          name: 'Stop future trading',
          link: '/app/dashboard/Stop-future-trading',
          icon: 'receipt-outline'
        }] : []),

        ...(userType !== 3 && (isForex || isStock) ? [{
          key: 'split script',
          name: 'Split script',
          link: '/app/dashboard/Split-script',
          icon: 'shuffle-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'NSEOPT management',
          name: 'NSEOPT management',
          link: '/app/dashboard/NSEOPT-management',
          icon: 'time-outline'
        }] : []),

        ...(userType === 4 ? [{
          key: 'MARQUEE',
          name: 'MARQUEE',
          link: '/app/dashboard/MARQUEE',
          icon: 'chatbox-ellipses-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'expiry validation',
          name: 'expiry validation',
          link: '/app/dashboard/Expiry-Validation',
          icon: 'alert-circle-outline'
        }] : []),

        ...(userType === 4 || userType === 5 ? [{
          key: 'notifcation',
          name: 'Notifcation',
          link: '/app/dashboard/Notifcation',
          icon: 'notifications-outline'
        }] : []),

        ...(userType === 4 || userType === 5 ? [{
          key: 'level import',
          name: 'level import',
          link: '/app/dashboard/level-import',
          icon: 'document-attach-outline'
        }] : []),

        ...(userType === 3 ? [{
          key: 'master qty setting',
          name: 'master qty setting',
          link: '/app/dashboard/Master-QTY-Setting',
          icon: 'time-outline'
        }] : []),

        ...(userType !== 3 ? [{
          key: 'time setting',
          name: 'Time Setting',
          link: '/app/dashboard/Time-Setting',
          icon: 'alarm-outline'
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