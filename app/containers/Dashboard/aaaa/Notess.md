### ASHISH SIR

- forex previous valan trade :
  /datatables/order_book_forex_old in filter

  - is_pending
  - is_execute
  - Trade after
  - Trade before
    Is this filter working from backend ?

- page:bulk trading

  - /datatables/order_book_new aa api ma
    /ajaxfiles/bulk_trading_report aa api in start end date pass kare 6 to result nathi avta
  - datatables/bulk_trade_list : what to do its response

- ajaxfiles/bulk_trading_report : aama backend thi pagination nai avtu

- position page's data's LTP value is not coming in api

  - Forex position has LTP

- previous-valan-trade, require pagination
  - 13095 records comes in single api call, page turns into unresponsive

---

## BAKI

- adjust loader and pagination, for mobile and desktop

  - tradeeditdeletelog
  - tradeeditdeletelogold
  - cash edit delete log
  - auto square up log
  - Valan

- previous valan trade : have multiple filters on screen but in api few is passing, is that all filter need to be pass in api ? kk

- Manual Trade : kk

  - get_master_name_search
  - get_broker_name_search
  - these two calls, but ui has not master and broker filter

  - in filter : lot, quantity, price accept alphabetic value also, clear btn not clear lot and quantity

- in mobile, Margin Management have no filter kk

  - table horizontal scroll
  - rows per page not working
  - no pagination from backend - stock/forex both
  - stock/forex both

- Scriptwiselot && Timesetting && Expiryvalidation : check pagination

- Nseoptmanagement && Orderlimit : onFilterApply() not used, onFilterApply : used for apply filter of page

- bulk terading filter have apply or submit (ashish sir)

---

- search filter
  - mobile/desktop view
  - padding

---

## WHAT I HAVE DONE

- /datatables/order_book_new, same api has 6 functions in api.js and used it across multiple files

- position forex/stock search not working

- orderbook stock/forex : seach export pdf csv added

- previous-valan-trade stock/forex : search not working

- header title replaceAll('-',' '), adjust size and line height

- summary report(stock/forex) :

  - filter : align valan_id and other filters properly
  - loader

- Brokrage refresh : adjust valan_id filter

- summary report :
- valan id filter may be out of filter component
- in mobile, loading is not centered

- after selecting valan id loading icon shows, or suddenly table data shows, that shouldnt happen

---

<br><br><br><br><br><br><br><br><br><br><br>

- after click on apply ,filter's value then only should pass with api

bill filter >> search not working

pdf > html content

in pdf , should all records should be there or current page's record

merge >> billfilter

Brokrage refresh >> searchPdfCsv component remaining to set
