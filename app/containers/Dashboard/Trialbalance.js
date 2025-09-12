import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";

const Trialbalance = () => {
    const queryParams = new URLSearchParams(useLocation().search);
    const dataStored = JSON.parse(sessionStorage.getItem("data"));

    if (!dataStored) {
        alert("Session expired");
        return null;
    }

    const userType = parseInt(dataStored?.user_type, 10);

    const [filters, setFilters] = useState({
        all: false,
        master: false,
        broker: false,
        client: false,
    });

    // Automatically redirect for userType 4 or 5
    useEffect(() => {
        if (userType === 4 || userType === 5) {
            const BASE_URL = "http://128.199.126.171/~goldorg/pdf/trial_balance";
            const url = new URL(BASE_URL);
            url.searchParams.set("isAll", "1"); // default for these user types
            url.searchParams.set("is", "1");
            url.searchParams.set("k", dataStored.auth_key);
            url.searchParams.set("lui", dataStored.user_id);

            window.open(url.toString(), "_blank");
        }
    }, [userType, dataStored]);

    // Hide UI for userType 4 or 5
    if (userType === 4 || userType === 5) {
        return null;
    }

    const handleCheckboxChange = (key) => {
        if (key === "all") {
            setFilters({
                all: !filters.all,
                master: false,
                broker: false,
                client: false,
            });
        } else {
            setFilters((prev) => ({
                ...prev,
                [key]: !prev[key],
                all: false,
            }));
        }
    };

    const handleSubmit = () => {
        const BASE_URL = "http://128.199.126.171/~goldorg/pdf/trial_balance";
        const url = new URL(BASE_URL);

        url.searchParams.set("isAll", filters.all ? "1" : "0");
        url.searchParams.set("onlyMasters", filters.master ? "1" : "0");
        url.searchParams.set("onlyBrokers", filters.broker ? "1" : "0");
        url.searchParams.set("onlyClients", filters.client ? "1" : "0");
        url.searchParams.set("is", "1");
        url.searchParams.set("k", dataStored.auth_key);
        url.searchParams.set("lui", dataStored.user_id);

        window.open(url.toString(), "_blank");
    };

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                {/* All checkbox always visible */}
                <label>
                    <input
                        type="checkbox"
                        checked={filters.all}
                        onChange={() => handleCheckboxChange("all")}
                    />
                    All
                </label>

                {/* Only Master: visible if userType===3 */}
                {userType === 3 && (
                    <>
                        <label>
                            <input
                                type="checkbox"
                                checked={filters.master}
                                disabled={filters.all}
                                onChange={() => handleCheckboxChange("master")}
                            />
                            Master
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={filters.broker}
                                disabled={filters.all}
                                onChange={() => handleCheckboxChange("broker")}
                            />
                            Broker
                        </label>
                    </>
                )}

                {/* Client: visible if userType===2 or 3 */}
                {(userType === 2 || userType === 3) && (
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.client}
                            disabled={filters.all}
                            onChange={() => handleCheckboxChange("client")}
                        />
                        Client
                    </label>
                )}

                {/* Submit button */}
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{
                        borderRadius: 2,
                        paddingX: 2,
                        paddingY: 0.5,
                        textTransform: "none",
                        fontWeight: 500,
                        minWidth: 100,
                        "&:hover": {
                            backgroundColor: "#5a6268",
                        },
                    }}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default Trialbalance;
