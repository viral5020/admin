import React from "react";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";

const Pagination = ({ currentPage, totalPages, setCurrentPage, setPageSize, pageSize }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pt: 2,
                flexWrap: "wrap",
                gap: 2,
            }}
        >
            <TextField
                select
                label="Rows per page"
                value={pageSize}
                onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0);
                }}
                size="small"
                sx={{ width: 150, flexShrink: 0 }}
            >
                {[10, 25, 50].map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>

            {/* Page Numbers */}
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                {/* Prev Button */}
                <Button
                    size="small"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    color="secondary"
                    sx={{ mr: 1 }}
                >
                    Prev
                </Button>

                {/* Page Buttons */}
                {[...Array(totalPages)].map((_, i) => {
                    if (
                        i === 0 ||
                        i === totalPages - 1 ||
                        (i >= currentPage - 1 && i <= currentPage + 1)
                    ) {
                        return (
                            <Button
                                key={i}
                                size="small"
                                variant={i === currentPage ? "contained" : "outlined"}
                                color="secondary"
                                onClick={() => setCurrentPage(i)}
                                sx={{ mx: 0.3, minWidth: "30px" }}
                            >
                                {i + 1}
                            </Button>
                        );
                    }
                    if (
                        (i === 1 && currentPage > 2) ||
                        (i === totalPages - 2 && currentPage < totalPages - 3)
                    ) {
                        return (
                            <Typography key={i} sx={{ mx: 0.5 }}>
                                ...
                            </Typography>
                        );
                    }
                    return null;
                })}

                {/* Next Button */}
                <Button
                    size="small"
                    disabled={currentPage + 1 >= totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    color="secondary"
                    sx={{ ml: 1 }}
                >
                    Next
                </Button>

                {/* Go to Page */}
                <TextField
                    label="Go to page"
                    type="number"
                    size="small"
                    InputProps={{ inputProps: { min: 1, max: totalPages } }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const page = parseInt(e.target.value, 10) - 1;
                            if (!isNaN(page) && page >= 0 && page < totalPages) {
                                setCurrentPage(page);
                            }
                        }
                    }}
                    sx={{ width: 100, ml: 2 }}
                />
            </Box>
        </Box>
    );
};

export default Pagination;
