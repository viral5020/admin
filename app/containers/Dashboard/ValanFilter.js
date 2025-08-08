import React, { useEffect, useState } from 'react';
import { Grid, TextField, CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { getInputBoxStyle } from './filters/inputBoxStyle';

const ValanFilter = ({ valanId, setValanId, isDarkMode }) => {
  const [valanOptions, setValanOptions] = useState([]);
  const [loadingValan, setLoadingValan] = useState(false);
  const [inputValan, setInputValan] = useState('');

  useEffect(() => {
    if (!inputValan || inputValan.trim().length < 1) {
      setValanOptions([]);
      return;
    }

    const fetchValanNames = async () => {
      setLoadingValan(true);
      try {
        const response = await axios.get(
          `http://128.199.126.171/~goldorg/ajaxfiles/get_valan_name_search?term=${encodeURIComponent(inputValan)}`
        );

        const data = Array.isArray(response.data) ? response.data : [];

        // Ensure proper formatting: value + label keys
        const formatted = data.map(item => ({
          label: item.label || item.name || item.value || '',
          value: item.value || item.id || item.label || '',
        }));

        setValanOptions(formatted);
      } catch (err) {
        console.error('Error fetching Valan IDs:', err);
        setValanOptions([]);
      } finally {
        setLoadingValan(false);
      }
    };

    const debounce = setTimeout(fetchValanNames, 400); // Slightly longer debounce
    return () => clearTimeout(debounce);
  }, [inputValan]);

  const selectedOption = valanOptions.find(opt => opt.value === valanId) || null;

  return (
    <Grid item xs={12} sm={6} md={4} lg={3.6}>
      <Autocomplete
        size="small"
        options={valanOptions}
        getOptionLabel={(option) => option.label || ''}
        loading={loadingValan}
        value={selectedOption}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onInputChange={(event, newInputValue) => setInputValan(newInputValue)}
        onChange={(event, newValue) => setValanId(newValue?.value || '')}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Valan ID"
            fullWidth
            sx={getInputBoxStyle(isDarkMode)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingValan && (
                    <CircularProgress color="inherit" size={16} />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        noOptionsText="Start typing to search..."
      />
    </Grid>
  );
};

export default ValanFilter;
