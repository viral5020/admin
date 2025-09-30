import React, { useState } from 'react';
import AutoSuggestFilter from './filters/AutoSuggestFilter';

const ValanFilter = ({ valanId, setValanId }) => {
  const [valanOptions, setValanOptions] = useState([]);

  return (
    <AutoSuggestFilter
      fieldName="valan"
      label="Valan ID"
      field={valanId}
      setField={setValanId}
      options={valanOptions}
      setOptions={setValanOptions}
    />
  );
};

export default ValanFilter;
