### ASHISH SIR

- Bulk trading : Whole Page working

  - /datatables/order_book_new aa api ma
    /ajaxfiles/bulk_trading_report aa api in `start end date` pass kare 6 to result nathi avta
  - datatables/bulk_trade_list : what to do its response

- position page's data's LTP value is not coming in api

  - In position, Before : LTP shows only for qty > 0, ma'am
  - Forex position has LTP

- OrderBook vs Previous valan :

  - Today/This-Week filter not in valan
  - remain modify btn in valan, modify btn in orderbook depends on response's `modify` key
  - Trade Export Btn not in valan

  - Forex order : Order Price -> net_rate
  - Forex order :
    - Order Price -> trd_rate
    - Net Price -> net_rate
  - net_rate vs trd_rate in orderbook and valan
  - net price in valan, not in orderbook
  - modify key gets in stock orderbokmapi but not in forex orderbook api,<br>should modify btn need to use in forex order book ?

---

- Manual Trade :

  - Can user enter desimal point value in Lot ?
  - flow : user 1st select market > then select script > then lot > then qty , so accordingly disable fields

---

## BAKI

- (vv) Id LHS of SearchPdfCsv component have filter(today/this week), then take SearchPdfCsv to 2nd line and in 1st line filterbtn and filter(today/this week)

- (vv) page's parent tag
  `<div style={{ padding: 16 }}>`
  To
  `<div style={{ padding: !isMobile ? 16 : 0 }}>`

- (kk) Margin Management : rows per page not working (stock/forex both)

- Scriptwiselot && Timesetting && Expiryvalidation : check pagination

- Nseoptmanagement && Orderlimit : onFilterApply() not used, onFilterApply : used for apply filter of page

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
