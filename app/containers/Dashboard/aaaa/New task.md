- Modify btn of order book/prev_valan(stock/forex)

---

- BulkTrade page

  1. `bulk_trade_list`

     - then set `response.data.minimun` key to _NoOfOrder_

  2. then call `bulk_trading_report` with updated _NoOfOrder_ value

  _(User change `No of order` and click `Submit`(or `Apply`))_

  3. call `set_bulk_trading` api (filter apply api)

  4. then call `bultk_trading_report` api with updated _NoOfOrder_

     - then set `response.data.minimun` key to _NoOfOrder_

---

- Forex previous valan trade :
  `/datatables/order_book_forex_old` in filter

  - Trade after --> pass `end_date`
  - Trade before --> pass `start_end`
