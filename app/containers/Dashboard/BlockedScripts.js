import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery as useMUIQuery,
  Autocomplete,
  useTheme,
  CircularProgress,
  Grid,
  Tooltip,
} from "@mui/material";
import axios from "axios";

const OrderPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMUIQuery(theme.breakpoints.down("sm"));

  const [positionData, setPositionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [selectedMarket, setSelectedMarket] = useState(null);
  const [selectedScripts, setSelectedScripts] = useState([]);

  const [market, setMarket] = useState('');
  const [script, setScript] = useState([]);
  const [marketOptions, setMarketOptions] = useState([]);
  const [scriptOptions, setScriptOptions] = useState([]);
  const [isScriptNameDisable, setIsScriptNameDisable] = useState(true)

  // Fetch dropdown options
  // const fetchMarketOptions = async () => {
  //   try {
  //     const res = await axios.get("/ajaxfiles/get_market_name_search");
  //     setMarketOptions(res.data?.markets || []);
  //   } catch (err) {
  //     console.error("Error loading market options", err);
  //   }
  // };

  // const fetchScriptOptions = async () => {
  //   try {
  //     const res = await axios.get("/ajaxfiles/get_script_name_search");
  //     setScriptOptions(res.data?.scripts || []);
  //   } catch (err) {
  //     console.error("Error loading script options", err);
  //   }
  // };

  // Main data fetch
  const fetchPositionData = async () => {
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    if (!dataStored) return;

    setLoading(true);
    try {
      const payload = {
        is_app: "1",
        login_user_id: dataStored.user_id,
        auth_key: dataStored.auth_key,
        market: selectedMarket?.name || "",
        scripts: selectedScripts.map((s) => s.name).join(","),
        search_text: searchText.trim(),
      };

      console.log("🔍 Fetching with payload:", payload);

      const response = await fetch(
        "http://128.199.126.171/~goldorg/ajaxfiles/setting/list_block_script.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result.status === "ok") {
        setPositionData(result.data || []);
      } else {
        console.warn("API returned error:", result.status);
        setPositionData([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch position data", err);
      setPositionData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchMarketOptions();
    // fetchScriptOptions();
    fetchPositionData(); // Initial load
    handleFetch('', "market");
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPositionData();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchText, selectedMarket, selectedScripts]);

  const inputBoxStyle = {
    backgroundColor: isDarkMode ? '#263238' : '#fff',
    borderRadius: 1,
    '& .MuiOutlinedInput-root': {
      height: 40,
      '& fieldset': {
        borderColor: '#c4c4c4',
      },
      '&:hover fieldset': {
        borderColor: '#000',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#000',
      },
    },
  };

  useEffect(() => {
    console.log('market', market);
    if (Object.keys(market || {}).length === 0) {
      setScript([]);
      setIsScriptNameDisable(true);
    } else {
      market.id ? handleFetch('', 'script') : null;
      setIsScriptNameDisable(false);
    }
  }, [market])

  // Utility fetcher
  async function fetchOptions(url, params, setter) {
    try {
      const { data } = await axios.post(url, params); // POST request with body
      const results = data.results;
      setter(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error(`Error fetching from ${url}`, err);
      setter([]);
    }
  };

  // Autocomplete handlers
  function handleFetch(term, type) {
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    // if (!term) return;
    let params = {
      is_app: 1,
      login_user_id: dataStored?.user_id,
      auth_key: dataStored?.auth_key,
    }

    const url = 'http://128.199.126.171/~goldorg/ajaxfiles'

    switch (type) {
      case 'market':
        fetchOptions(`${url}/get_market_name_search`, { ...params, term }, setMarketOptions);
        break;
      case 'script':
        fetchOptions(`${url}/get_script_name_search`, { ...params, term, market: market.id }, setScriptOptions);
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Filter/Search Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", // Always column to control search on 2nd line
          gap: 1,
          mb: 1.5,
        }}
      >
        {/* First Row: Filters and Add */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap", // Wrap if screen is too small
            width: "100%",
          }}
        >
          {/* Market Name */}
          <Grid item xs={12} sm={6} md={3} lg={2.4}>
            <Autocomplete
              options={marketOptions}
              getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
              value={market || null}
              inputValue={market?.text || ''}
              onInputChange={(e, val, reason) => {
                (reason === 'input') && setMarket({ text: val }); // tempararyly set market value
                handleFetch(val, 'market');
              }}
              onChange={(e, val) => setMarket(val)}
              onBlur={() => {  // on focus out, if inputvalue don't match with any options then setMarket(null)
                const matched = marketOptions.find((opt) => (typeof opt === 'string' ? opt : opt?.text) === market?.text);
                (!matched) && setMarket(null);  // clear if unmatched
                // handleFetch('', 'market');
              }}
              renderInput={(params) => <TextField {...params} label="Market" size="small" sx={inputBoxStyle} />}
              noOptionsText="No Market found"
              fullWidth
              sx={inputBoxStyle}
            />
          </Grid>
          {/* <Autocomplete
            options={marketOptions}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name
            }
            value={selectedMarket}
            onChange={(e, value) => setSelectedMarket(value)}
            renderInput={(params) => (
              <TextField {...params} label="Market" size="small" />
            )}
            sx={{ minWidth: 150 }}
          /> */}



          {/* Script Name */}
          <Grid item xs={12} sm={6} md={3} lg={2.4}>
            <Tooltip arrow disableHoverListener={!isScriptNameDisable}
              title={isScriptNameDisable ? "First Select Market Name" : ""}
            >
              <Autocomplete
                multiple
                disabled={isScriptNameDisable}
                options={scriptOptions}
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : option?.text || ''
                }
                value={Array.isArray(script) ? script : []}
                filterSelectedOptions
                onInputChange={(e, val, reason) => {
                  if (reason === 'input') {
                    handleFetch(val, 'script');
                  }
                }}
                onChange={(e, val) => {
                  setScript(val);
                }}
                renderOption={(props, option) => {
                  const optionText = typeof option === 'string' ? option : option.text;
                  const isSelected = script.some(
                    (item) =>
                      (typeof item === 'string' ? item : item.text) === optionText
                  );

                  return (
                    <li
                      {...props}
                      style={{
                        backgroundColor: isSelected
                          ? isDarkMode
                            ? '#333'
                            : '#e0f7fa'
                          : 'inherit',
                        color: isSelected ? '#999' : 'inherit',
                        pointerEvents: isSelected ? 'none' : 'auto',
                        opacity: isSelected ? 0.6 : 1,
                      }}
                      aria-disabled={isSelected}
                    >
                      {optionText}
                    </li>
                  );
                }}

                // onBlur={() => {
                //     // Filter only those scripts which exist in scriptOptions
                //     const validScripts = script.filter((selectedItem) =>
                //         scriptOptions.some((opt) =>
                //             (typeof opt === 'string' ? opt : opt?.text) === selectedItem?.text
                //         )
                //     );
                //     console.log('validScripts', validScripts);
                //     setScript(validScripts);
                // }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Script"
                    size="small"
                    sx={inputBoxStyle}
                  />
                )}
                noOptionsText="No Script found"
                fullWidth
                sx={inputBoxStyle}
              />

            </Tooltip>
          </Grid>


          {/* <Autocomplete
            multiple
            options={scriptOptions}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name
            }
            value={selectedScripts}
            onChange={(e, value) => setSelectedScripts(value)}
            renderInput={(params) => (
              <TextField {...params} label="Script(s)" size="small" />
            )}
            sx={{ minWidth: 150 }}
          /> */}

          <Button
            variant="contained"
            color="secondary"
            onClick={() => alert("Add clicked")}
            sx={{
              px: 2,
              borderRadius: 1,
              whiteSpace: "nowrap",
              mt: -0.5, // Move the button slightly up
            }}
          >
            ADD
          </Button>

        </Box>

        {/* Second Row: Search Box */}
        <TextField
          fullWidth
          placeholder="Search positions..."
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: "100%" }}
        />
      </Box>


      {/* Result Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",         // 1 per row on mobile
            sm: "1fr 1fr",     // 2 per row on small tablets
            md: "1fr 1fr",     // 2 per row on medium screens
            lg: "1fr 1fr 1fr", // ✅ 3 per row on desktop
          },
          gap: 1.5,
        }}
      >
        {positionData.map((row, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 0.5,
              py: 0.2,
              borderRadius: 2,
              backgroundColor: "background.paper",
              border: `1px solid ${theme.palette.divider}`,
              backgroundImage: `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}),
                         linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              boxShadow: 1,
              overflow: "hidden",
              minHeight: 60,
            }}
          >
            {/* Left: Script + Market */}
            <Box
              sx={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                flex: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                component="span"
                dangerouslySetInnerHTML={{ __html: row.script_name }}
                sx={{
                  fontSize: 16,
                  mr: 1,
                  verticalAlign: "middle",
                  display: "inline-block",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "text.primary",
                }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                component="span"
                sx={{
                  fontSize: 15,
                  verticalAlign: "middle",
                }}
              >
                {row.market_type_name}
              </Typography>
            </Box>

            {/* Right: Remove Button */}
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                alert("Remove clicked");
              }}
              sx={{
                textTransform: "none",
                fontSize: 12,
                fontWeight: 600,
                ml: 2,
                minWidth: 70,
                flexShrink: 0,
                borderRadius: 2,
                backgroundColor: "#fdecea",
                borderColor: "error.main",
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#f9d5d3",
                  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
                  borderColor: "error.dark",
                },
              }}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Box>

    </Box>
  );
};

export default OrderPage;
