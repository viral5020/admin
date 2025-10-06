import React, { useState } from "react";
import {
    Button,
    InputAdornment,
    TextField,
    Box,
    useTheme,
    useMediaQuery,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";

import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatToTwoDecimals, getLastPath, humanize } from "../helpers/utilFunc";
import { useLocation } from "react-router-dom";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";


const SearchPdfCsv = ({
    placeholder,
    setSearchText,
    searchText,
    logs,
    keyArr,
    colArr,
    isLoading
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const location = useLocation();
    const title = humanize(getLastPath(location.pathname));

    const [anchorEl, setAnchorEl] = useState(null);

    // ---- Handlers for Menu ----
    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    // ---- Export CSV ----
    const handleExportCSV = () => {
        const csv = Papa.unparse(logs);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `${title}.csv`);
        handleCloseMenu();
    };

    // ---- Export PDF ----
    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text(title, 14, 10);
        autoTable(doc, {
            startY: 20,
            head: [colArr],
            body: logs.map((log) =>
                keyArr.map((key) => {
                    if (key.isDesimal) {
                        return formatToTwoDecimals(log[key.name]) ?? "-";
                    } else if (key.isParse) {
                        return JSON.parse(log[key.name])?.user_id ?? "-";
                    } else {
                        return log[key] ?? "-";
                    }
                })
            ),
            theme: "grid",
        });
        doc.save(`${title}.pdf`);
        handleCloseMenu();
    };

    return (
        <Box
            sx={{
                my: 1,
                display: "flex",
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
            }}
        >
            {/* Search Box */}
            <TextField
                variant="outlined"
                placeholder={placeholder || "Search logs..."}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="small"
                sx={{ flex: 1, minWidth: 195, maxWidth: "360px" }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment
                            position="start"
                            sx={{ position: "relative", bottom: "5px" }}
                        >
                            <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Buttons */}
            {!isMobile ? (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleExportCSV}
                        sx={{
                            borderRadius: 1,
                            textTransform: "capitalize",
                            px: 1,
                            minWidth: "auto",
                        }}
                    >
                        Export CSV
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleExportPDF}
                        sx={{
                            borderRadius: 1,
                            textTransform: "capitalize",
                            px: 1,
                            minWidth: "auto",
                        }}
                    >
                        Export PDF
                    </Button>
                </Box>
            ) : (
                <>
                    {/* Mobile: single download icon */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleOpenMenu}
                        sx={{
                            borderRadius: 1,
                            minWidth: "auto",
                            p: 1,
                            mr: 1,
                            boxShadow: theme.shadows[1],
                        }}
                    >
                        <DownloadIcon />
                    </Button>

                    {/* Tooltip-like small menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        PaperProps={{
                            sx: {
                                borderRadius: 2,
                                minWidth: 140,
                                p: 0.5,
                                boxShadow: theme.shadows[4],
                            },
                        }}
                    >
                        <MenuItem
                            onClick={handleExportCSV}
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                            <TableViewIcon fontSize="small" color="primary" />
                            Export CSV
                        </MenuItem>

                        <MenuItem
                            onClick={handleExportPDF}
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                            <PictureAsPdfIcon fontSize="small" color="secondary" />
                            Export PDF
                        </MenuItem>
                    </Menu>

                </>
            )}
        </Box>
    );
};

export default SearchPdfCsv;
