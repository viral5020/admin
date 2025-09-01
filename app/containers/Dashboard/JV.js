import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// import your components
import Jventry from "./Jventry";
import Cashentry from "./Cashentry";

const CashJvTabs = () => {
    const theme = useTheme();
    const [tab, setTab] = useState(0);

    return (
        <Box>
            {/* Tabs */}
            <Tabs
                value={tab}
                onChange={(e, val) => setTab(val)}
                variant="fullWidth"
                sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    minHeight: "26px",
                    "& .MuiTab-root": {
                        fontSize: "0.7rem",
                        minHeight: "26px",
                        padding: "2px 4px",
                        fontWeight: 600,
                        textTransform: "none",
                    },
                    "& .Mui-selected": {
                        background:
                            "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #21cbf3 100%)",
                        color: "#fff",
                        borderRadius: "4px 4px 0 0",
                    },
                    "& .MuiTabs-indicator": { display: "none" },
                }}
            >
                <Tab label="Cash" />
                <Tab label="JV" />
            </Tabs>

            {/* Tab Content */}
            <Box sx={{ mt: 2 }}>
                {tab === 0 && <Cashentry />}
                {tab === 1 && <Jventry />}
            </Box>
        </Box>
    );
};

export default CashJvTabs;
