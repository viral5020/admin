import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useMediaQuery as useMUIQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { fetchPositionDataAPI } from "./API/API";
import SearchPdfCsv from "./filters/SearchPdfCsv";

const colArr = [
  "Script Name",
  "Banned",
  "Blocked",
]

const keyArr = [
  "script_name",
  "banned",
  "blocked"
];

const BannedBlockedScript = () => {
  const theme = useTheme();
  const isMobile = useMUIQuery(theme.breakpoints.down("sm"));

  const [positionData, setPositionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [selectedMarket, setSelectedMarket] = useState(null);
  const [selectedScripts, setSelectedScripts] = useState([]);

  // Main data fetch
  const fetchPositionData = async () => {
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    if (!dataStored) return;

    setLoading(true);
    try {
      const result = await fetchPositionDataAPI({
        user_id: dataStored.user_id,
        auth_key: dataStored.auth_key,
        selectedMarket,     // make sure you have this state/prop
        selectedScripts,    // make sure you have this state/prop
        searchText,
      });

      if (result.status === "ok") {
        setPositionData(result.script_list || []);
      } else {
        console.warn("API returned error:", result.status);
        setPositionData([]);
      }
    } catch (err) {
      setPositionData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositionData(); // Initial load
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPositionData();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchText, selectedMarket, selectedScripts]);

  // Filter banned & blocked
  const filteredData = positionData.filter(
    (row) => row.banned === true || row.blocked === true
  );

  return (
    <Box sx={{ p: 2 }}>
      <SearchPdfCsv
        searchText={searchText}
        setSearchText={setSearchText}
        logs={filteredData}
        colArr={colArr}
        keyArr={keyArr}
      />
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : filteredData.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // 1 per row on mobile
              sm: "1fr 1fr", // 2 per row on small tablets
              md: "1fr 1fr", // 2 per row on medium screens
              lg: "1fr 1fr 1fr", // 3 per row on desktop
            },
            gap: 1.5,
          }}
        >

          {filteredData.map((row, index) => (
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
              <Box
                sx={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {/* Script name */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: 15, verticalAlign: "middle", fontWeight: "bold" }}
                >
                  {row.script_name}
                </Typography>

                {/* Reason beside name */}
                {(row.banned || row.blocked) && (
                  <Typography
                    variant="caption"
                    sx={{ color: "error.main", fontWeight: 500 }}
                  >
                    {row.banned && "Banned by NSE"}
                    {row.blocked && "Blocked by Upline"}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}


        </Box>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 3 }}
        >
          No banned & blocked scripts found.
        </Typography>
      )}
    </Box>
  );
};

export default BannedBlockedScript;
