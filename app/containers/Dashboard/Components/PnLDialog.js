import React from "react";
import {
    Box,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import CloseIcon from "@mui/icons-material/Close";
import { Bar, Doughnut } from "react-chartjs-2";

const PnLDialog = ({ open, onClose, dummyInstrumentPnL }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmallScreen = window.innerWidth <= 700;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            {/* --- Header --- */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1.5,
                    backdropFilter: "blur(6px)",
                    background:
                        "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #21cbf3 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        display: "flex",
                        alignItems: "center",
                        textShadow: "0 0 6px rgba(33,203,243,0.9)",
                    }}
                >
                    <BarChartIcon sx={{ mr: 1, fontSize: "2rem", color: "#fff" }} />
                    PnL by Instrument
                </Typography>

                <IconButton
                    size="small"
                    sx={{
                        color: "#fff",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "50%",
                        "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                    }}
                    onClick={onClose}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* --- Content --- */}
            <DialogContent>
                {/* --- Bar Chart --- */}
                <Box sx={{ width: "100%" }}>
                    <Bar
                        data={{
                            labels: Object.keys(dummyInstrumentPnL),
                            datasets: [
                                {
                                    label: "P/L (₹)",
                                    data: Object.values(dummyInstrumentPnL),
                                    backgroundColor: Object.values(dummyInstrumentPnL).map((val) =>
                                        val >= 0
                                            ? "rgba(75,192,192,0.6)"
                                            : "rgba(255,99,132,0.6)"
                                    ),
                                    borderColor: Object.values(dummyInstrumentPnL).map((val) =>
                                        val >= 0
                                            ? "rgba(75,192,192,1)"
                                            : "rgba(255,99,132,1)"
                                    ),
                                    borderWidth: 2,
                                    borderRadius: 8,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    callbacks: {
                                        label: (context) =>
                                            `P/L: ₹${context.raw.toLocaleString("en-IN")}`,
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    ticks: { font: { weight: "bold", size: 13 } },
                                    grid: { display: false },
                                },
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: (value) => `₹${value.toLocaleString("en-IN")}`,
                                        font: { weight: "bold", size: 13 },
                                    },
                                    grid: { color: "rgba(0,0,0,0.1)", borderDash: [5, 5] },
                                },
                            },
                            animation: { duration: 1200, easing: "easeOutQuart" },
                        }}
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* --- Doughnut + Legend Section --- */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 7,
                        width: "100%",
                        flexDirection: isSmallScreen ? "column" : "row",
                        pb: 4,
                    }}
                >
                    {/* Doughnut Chart */}
                    <Box sx={{ width: "100%", display: 'flex', justifyContent: 'center', flex: isSmallScreen && 1 }}>
                        <Box
                            sx={{
                                // height: '35vw',
                                // width: { xs: "100%", md: "50%" },
                                width: isMobile ? '200px' : "100%",
                                minWidth: '200px',
                                maxWidth: '300px',
                                position: "relative",
                                px: 1,
                                pb: isSmallScreen ? 3 : 0,
                            }}
                        >
                            <Doughnut
                                data={{
                                    labels: Object.keys(dummyInstrumentPnL),
                                    datasets: [
                                        {
                                            data: Object.values(dummyInstrumentPnL).map((v) =>
                                                Math.abs(v)
                                            ),
                                            backgroundColor: Object.values(dummyInstrumentPnL).map(
                                                (val) =>
                                                    val >= 0
                                                        ? "rgba(75,192,192,0.7)"
                                                        : "rgba(255,99,132,0.7)"
                                            ),
                                            borderColor: "#fff",
                                            borderWidth: 2,
                                            hoverOffset: 10,
                                        },
                                    ],
                                }}
                                options={{
                                    cutout: "65%",
                                    responsive: true,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => {
                                                    const total = context.dataset.data.reduce(
                                                        (a, b) => a + b,
                                                        0
                                                    );
                                                    const val = context.raw;
                                                    const pct = ((val / total) * 100).toFixed(1);
                                                    const orig = dummyInstrumentPnL[context.label];
                                                    const sign = orig >= 0 ? "+" : "-";
                                                    return `${context.label}: ${sign}₹${Math.abs(
                                                        orig
                                                    ).toLocaleString("en-IN")} (${pct}%)`;
                                                },
                                            },
                                        },
                                    },
                                    animation: {
                                        animateScale: true,
                                        animateRotate: true,
                                        duration: 1300,
                                    },
                                }}
                                plugins={[
                                    {
                                        id: "centerText",
                                        beforeDraw: (chart) => {
                                            const { width, chartArea, ctx } = chart;
                                            const total = Object.values(dummyInstrumentPnL).reduce(
                                                (a, b) => a + b,
                                                0
                                            );
                                            const color =
                                                total >= 0
                                                    ? "rgba(75,192,192,1)"
                                                    : "rgba(255,99,132,1)";

                                            const fullText = `Total P/L: ₹${total.toLocaleString(
                                                "en-IN"
                                            )}`;
                                            const labelText = "Total P/L:";
                                            const valueText = `₹${total.toLocaleString("en-IN")}`;

                                            ctx.save();
                                            const fontSize = 18;
                                            ctx.font = `600 ${fontSize}px Poppins`;
                                            ctx.textBaseline = "middle";
                                            ctx.textAlign = "center";
                                            ctx.fillStyle = color;

                                            const textWidth = ctx.measureText(fullText).width;
                                            const centerX = (chartArea.left + chartArea.right) / 2;
                                            const centerY = (chartArea.top + chartArea.bottom) / 2;

                                            if (textWidth > width * 0.6) {
                                                ctx.fillText(labelText, centerX, centerY - fontSize / 1.5);
                                                ctx.fillText(valueText, centerX, centerY + fontSize / 1.5);
                                            } else {
                                                ctx.fillText(fullText, centerX, centerY);
                                            }

                                            ctx.restore();
                                        },
                                    },
                                ]}
                            />
                        </Box>
                    </Box>

                    {/* Scrollable Legend */}
                    <Box
                        sx={{
                            flex: isSmallScreen && 1,
                            width: "100%",
                            maxWidth: "400px",
                            ml: { md: 3 },
                            borderLeft: !isSmallScreen && "1px solid rgba(0,0,0,0.1)",
                            px: isMobile ? 0 : 2,
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" mb={isSmallScreen ? 0 : 2}>
                            Instrument Breakdown
                        </Typography>

                        <Box
                            sx={{
                                maxHeight: 400,
                                overflowY: "auto",
                                "&::-webkit-scrollbar": { width: "6px" },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "#888",
                                    borderRadius: "4px",
                                },
                                "&::-webkit-scrollbar-thumb:hover": {
                                    backgroundColor: "#555",
                                },
                                "&::-webkit-scrollbar-track": {
                                    backgroundColor: "#f1f1f1",
                                },
                            }}
                        >
                            {Object.entries(dummyInstrumentPnL).map(([name, value]) => {
                                const color =
                                    value >= 0
                                        ? "rgba(75,192,192,0.8)"
                                        : "rgba(255,99,132,0.8)";
                                const total = Object.values(dummyInstrumentPnL).reduce(
                                    (a, b) => a + Math.abs(b),
                                    0
                                );
                                const pct = ((Math.abs(value) / total) * 100).toFixed(1);

                                return (
                                    <Box
                                        key={name}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            mb: 1.5,
                                            gap: 1,
                                            mr: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 14,
                                                height: 14,
                                                borderRadius: "50%",
                                                backgroundColor: color,
                                            }}
                                        />
                                        <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
                                        <Typography
                                            fontWeight="bold"
                                            color={value >= 0 ? "teal" : "error"}
                                            sx={{ whiteSpace: "nowrap" }}
                                        >
                                            {value >= 0 ? "+" : "-"}₹
                                            {Math.abs(value).toLocaleString("en-IN")}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ ml: 1, whiteSpace: "nowrap" }}
                                        >
                                            ({pct}%)
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog >
    );
};

export default PnLDialog;
