import React from 'react';
import { SwipeableList, SwipeableListItem, LeadingActions, SwipeAction, TrailingActions, Type as ListType } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import toast from 'react-hot-toast';

const SwipeableStockList = ({ dummyData, setDummyData, isDarkMode }) => {
  const handleRemove = (stock) => {
    // Optimistically remove
    setDummyData((prev) => prev.filter((item) => item.id !== stock.id));

    let undo = false;

    toast.custom((t) => (
      <div style={{
        background: '#333',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: '220px'
      }}>
        <span>{stock.scriptName} Removed</span>
        <button
          style={{
            marginLeft: 12,
            background: 'transparent',
            border: '1px solid #fff',
            borderRadius: '4px',
            padding: '4px 8px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
          onClick={() => {
            undo = true;
            setDummyData((prev) => [stock, ...prev]);
            toast.dismiss(t.id);
          }}
        >
          Undo
        </button>
      </div>
    ), { duration: 2000 });

    // If user doesn't undo in 2s, you can call API here
    setTimeout(() => {
      if (!undo) {
        console.log(`${stock.scriptName} permanently deleted`);
        // Optionally call API
      }
    }, 2000);
  };

  return (
    <SwipeableList type={ListType.IOS} threshold={0.25}>
      {dummyData.map((stock) => {
        const isUp = stock.priceChange > 0;
        const color = isDarkMode
          ? isUp ? '#26a69a' : '#ef6d61'
          : isUp ? '#388055' : '#BB3536';

        return (
          <SwipeableListItem
            key={stock.id}
            leadingActions={
              <LeadingActions>
                <SwipeAction onClick={() => handleRemove(stock)}>
                  Delete
                </SwipeAction>
              </LeadingActions>
            }
            trailingActions={
              <TrailingActions>
                <SwipeAction destructive onClick={() => handleRemove(stock)}>
                  Delete
                </SwipeAction>
              </TrailingActions>
            }
          >
            <div style={{
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: isDarkMode ? '#222' : '#f5f5f5'
            }}>
              <span>{stock.scriptName}</span>
              <span style={{ color }}>{stock.ltp.toFixed(2)} ({stock.priceChangePercent.toFixed(2)}%)</span>
            </div>
          </SwipeableListItem>
        );
      })}
    </SwipeableList>
  );
};

export default SwipeableStockList;

const wanttedObj = {
  market_type_name:{
    script_name:{
      expiry:[script_expiry_orginal_format]
    }
  },
  market_type_name2:{
    script_name2:{
      expiry:[script_expiry_orginal_format2]
    }
  },
}

const obj = {
  "status": "ok",
  "cnbc": "https://www.youtube.com/embed/TD0A7fHAxKw",
  "scripts": [
    {
      "market_watch_id": "7883718",
      "market_type_id": "1",
      "market_type_name": "MCXFUT",
      "script_id": "1",
      "script_name": "GOLD",
      "script_expiry_id": "27256",
      "script_expiry_date": "2025-08-05",
      "script_expiry_type": "I",
      "script_lot_qty": "100",
      "script_expiry_orginal_format": "05AUG2025",
      "min_order": "0",
      "max_order": "10",
      "position_limit": "25",
      "quantity": 0
    },
    {
      "market_watch_id": "7895546",
      "market_type_id": "4",
      "market_type_name": "GLOBAL FUTURES",
      "script_id": "177",
      "script_name": "NASDAQ",
      "script_expiry_id": "27287",
      "script_expiry_date": "2025-09-19",
      "script_expiry_type": "I",
      "script_lot_qty": "70",
      "script_expiry_orginal_format": "19SEP2025",
      "min_order": "0",
      "max_order": "3750",
      "position_limit": "7500",
      "quantity": 0
    },
    {
      "market_watch_id": "7898735",
      "market_type_id": "4",
      "market_type_name": "GLOBAL FUTURES",
      "script_id": "176",
      "script_name": "S&P 500",
      "script_expiry_id": "27288",
      "script_expiry_date": "2025-09-19",
      "script_expiry_type": "I",
      "script_lot_qty": "250",
      "script_expiry_orginal_format": "19SEP2025",
      "min_order": "0",
      "max_order": "9600",
      "position_limit": "19200",
      "quantity": 0
    },
    {
      "market_watch_id": "7906972",
      "market_type_id": "2",
      "market_type_name": "NSEFUT",
      "script_id": "3",
      "script_name": "NIFTY",
      "script_expiry_id": "27297",
      "script_expiry_date": "2025-07-31",
      "script_expiry_type": "I",
      "script_lot_qty": "75",
      "script_expiry_orginal_format": "31JUL2025",
      "min_order": "0",
      "max_order": "2000",
      "position_limit": "4000",
      "quantity": 0
    },
    {
      "market_watch_id": "7906973",
      "market_type_id": "2",
      "market_type_name": "NSEFUT",
      "script_id": "4",
      "script_name": "BANKNIFTY",
      "script_expiry_id": "27298",
      "script_expiry_date": "2025-07-31",
      "script_expiry_type": "I",
      "script_lot_qty": "35",
      "script_expiry_orginal_format": "31JUL2025",
      "min_order": "0",
      "max_order": "1000",
      "position_limit": "2000",
      "quantity": 0
    },
    {
      "market_watch_id": "7906998",
      "market_type_id": "4",
      "market_type_name": "GLOBAL FUTURES",
      "script_id": "1189",
      "script_name": "GIFT NIFTY",
      "script_expiry_id": "27743",
      "script_expiry_date": "2025-07-31",
      "script_expiry_type": "I",
      "script_lot_qty": "50",
      "script_expiry_orginal_format": "31JUL2025",
      "min_order": "0",
      "max_order": "1500",
      "position_limit": "3000",
      "quantity": 0
    },
    {
      "market_watch_id": "7909598",
      "market_type_id": "1",
      "market_type_name": "MCXFUT",
      "script_id": "2",
      "script_name": "SILVER",
      "script_expiry_id": "27745",
      "script_expiry_date": "2025-09-05",
      "script_expiry_type": "I",
      "script_lot_qty": "30",
      "script_expiry_orginal_format": "05SEP2025",
      "min_order": "1",
      "max_order": "5",
      "position_limit": "15",
      "quantity": 0
    },
    {
      "market_watch_id": "7914156",
      "market_type_id": "4",
      "market_type_name": "GLOBAL FUTURES",
      "script_id": "175",
      "script_name": "DOW JONES 30",
      "script_expiry_id": "27286",
      "script_expiry_date": "2025-09-19",
      "script_expiry_type": "I",
      "script_lot_qty": "30",
      "script_expiry_orginal_format": "19SEP2025",
      "min_order": "0",
      "max_order": "1750",
      "position_limit": "3500",
      "quantity": 0
    }
  ]
}