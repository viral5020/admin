import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useDebounce } from "@uidotdev/usehooks";

const Pagination = ({
    currentPage,
    totalPages,
    setCurrentPage,
    setPageSize,
    pageSize = '',
    disablePagination = false, // new prop
}) => {
    const isMobile = useMediaQuery("(max-width:600px)");
    const [pageNo, setPageNo] = useState('')
    const debouncedPageNo = useDebounce(pageNo, 2000);
    const gotoPageRef = useRef();

    useEffect(() => {
        const page = parseInt(pageNo, 10) - 1;
        if (!isNaN(page) && page >= 0 && page < totalPages) {
            console.log('page', page);
            setCurrentPage(page);
        }
        setPageNo('');
        gotoPageRef.current.blur();
    }, [debouncedPageNo])

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: isMobile ? "center" : "space-between",
                alignItems: "center",
                pt: 2,
                flexDirection: isMobile ? "column" : "row",
                gap: 2,
                opacity: disablePagination ? 0.5 : 1, // dimmed if disabled
                pointerEvents: disablePagination ? "none" : "auto", // fully disabled
            }}
        >
            {/* Rows per page */}
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
                disabled={disablePagination}
            >
                {[10, 25, 50].map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>

            {/* Page Controls */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    rowGap: 2,
                    justifyContent: "center",
                }}
            >
                {/* Prev Button */}
                <Button
                    size="small"
                    disabled={disablePagination || currentPage === 0}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    color="secondary"
                    sx={{ p: 0, minWidth: 0 }}
                >
                    {isMobile ? <ArrowBackIosNewIcon /> : 'Prev'}
                </Button>

                {/* {!isMobile && (
                    <> */}
                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, i) => {
                    if (
                        i === 0 ||
                        i === totalPages - 1 ||
                        (i >= currentPage - 1 && i <= currentPage + 1 && !isMobile) ||
                        (i >= currentPage - 1 && i <= currentPage + 1 && isMobile && totalPages <= 5) ||
                        i === currentPage
                    ) {
                        return (
                            <Button
                                key={i}
                                size="small"
                                variant={i === currentPage ? "contained" : "outlined"}
                                color="secondary"
                                onClick={() => setCurrentPage(i)}
                                sx={{ minWidth: "30px" }}
                                disabled={disablePagination}
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
                    disabled={disablePagination || currentPage + 1 >= totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    color="secondary"
                    sx={{ p: 0, minWidth: 0 }}
                >
                    {isMobile ? <ArrowForwardIosIcon /> : 'Next'}
                </Button>

                {/* Go to Page */}
                <TextField

                    label="Go to page"
                    type="number"
                    size="small"
                    InputProps={{ inputProps: { min: 1, max: totalPages } }}
                    inputRef={gotoPageRef}
                    // onKeyDown={(e) => {
                    //     if (e.key === "Enter") {
                    //         const page = parseInt(e.target.value, 10) - 1;
                    //         if (!isNaN(page) && page >= 0 && page < totalPages) {
                    //             setCurrentPage(page);
                    //         }
                    //     }
                    // }}
                    value={pageNo}
                    onChange={e => setPageNo(e.target.value)}
                    sx={{ width: 100, ml: isMobile ? 0 : 2 }}
                    disabled={disablePagination}
                />
                {/* </>
                )} */}
            </Box>
        </Box>
    );
};

export default Pagination;
