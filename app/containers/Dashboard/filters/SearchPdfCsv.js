import React from "react";
import {
    Button,
    InputAdornment,
    TextField,
    Box,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatToTwoDecimals, getLastPath, humanize } from "../helpers/utilFunc";
import { useLocation } from "react-router-dom";

const SearchPdfCsv = ({ setSearchText, searchText, logs, keyArr, colArr }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const location = useLocation();
    const title = humanize(getLastPath(location.pathname))

    console.log('logs', logs);

    // Export CSV
    const handleExportCSV = () => {
        const csv = Papa.unparse(logs);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `${title}.csv`);
    };

    // Export PDF
    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text(title, 14, 10);
        autoTable(doc, {
            startY: 20,
            head: [colArr],
            body:
                logs.map((log) =>
                    keyArr.map(key => {
                        if (key.isDesimal) {
                            return formatToTwoDecimals(log[key.name]) ?? '-';
                        } else if (key.isParse) {
                            return JSON.parse(log[key.name])?.user_id ?? '-';
                        } else {
                            return log[key] ?? '-';
                        }
                    })),

            // didDrawCell: async (data) => {
            //     // Replace cells that contain HTML
            //     const htmlKeys = ["mym_html", "client_full_name", "script_name"]; // add all fields that have HTML
            //     const colKey = keyArr[data.column.index];

            //     if (htmlKeys.includes(colKey)) {
            //         const html = logs[data.row.index][colKey] ?? "-";
            //         // Clear default cell text
            //         data.cell.text = [];
            //         await doc.html(
            //             `<div style="font-size:10px;">${html}</div>`,
            //             {
            //                 x: data.cell.x + 1,
            //                 y: data.cell.y + 1,
            //                 width: data.cell.width - 2,
            //                 windowWidth: 800,
            //             }
            //         );
            //     }
            // },
            // styles: {
            //     cellPadding: 2,
            //     fontSize: 10,
            // },
            theme: "grid",
        });
        doc.save(`${title}.pdf`);
    };

    return (
        <Box
            sx={{
                display: "flex",
                // flexDirection: isMobile ? "column" : "row",
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
                // alignItems: isMobile ? "stretch" : "center",
                justifyContent: "space-between",
                width: "100%",
            }}
        >
            <TextField
                variant="outlined"
                placeholder="Search logs..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="small"
                sx={{ flex: 1, minWidth: 200, maxWidth: '360px' }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start" sx={{ position: 'relative', bottom: '5px' }}>
                            <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                        </InputAdornment>
                    ),
                }}
            />

            <Box sx={{ display: "flex", gap: 0.5 }}>
                <Button
                    variant="contained"  //outlined
                    color="primary"
                    onClick={handleExportCSV}
                    sx={{ borderRadius: 1, textTransform: "capitalize", px: 1, minWidth: 'auto' }}
                >
                    {!isMobile && 'Export'}  CSV
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleExportPDF}
                    sx={{ borderRadius: 1, textTransform: "capitalize", px: 1, minWidth: 'auto' }}
                >
                    {!isMobile && 'Export'}  PDF
                </Button>
            </Box>
        </Box>
    );
};

export default SearchPdfCsv;
