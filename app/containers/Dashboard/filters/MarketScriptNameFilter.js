import React, { useEffect, useState } from 'react';
import { forex_comex_market } from '../helpers/utilFunc';
import AutoSuggestFilter from './AutoSuggestFilter';

const MarketScriptNameFilter = ({
  script,
  setScript,
  setMarket,
  market,
  isScriptMultiSelect = false,
  isForex,
}) => {
  const [marketOptions, setMarketOptions] = useState(isForex ? forex_comex_market : []);
  const [scriptOptions, setScriptOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => { console.log('market', market); }, [market]);
  // useEffect(() => { console.log('script', script); }, [script]);


  return (
    <>
      <AutoSuggestFilter
        fieldName="market"
        label="Market"
        field={market}
        setField={setMarket}
        options={marketOptions}
        setOptions={setMarketOptions}
        setScript={setScript}
        setScriptOptions={setScriptOptions}
        isScriptMultiSelect={isScriptMultiSelect}
        isForex={isForex}
        setIsLoading={setIsLoading}
      />

      <AutoSuggestFilter
        fieldName="script"
        label="Script"
        isMultiSelect={isScriptMultiSelect}
        options={scriptOptions}
        field={script}
        setField={setScript}
        setOptions={setScriptOptions}
        isForex={isForex}
        market={market}
        isLoading={isLoading}
      />
    </>
  )
}

export default MarketScriptNameFilter