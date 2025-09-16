import React, { useState } from "react";
import {
    Typography,
    TextField,
    FormControlLabel,
    Button,
    Checkbox,
    FormGroup,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { addNotificationAPI } from "./API/API";

const Notificationn = () => {
    const [commonFormData, setCommonFormData] = useState({
        userType: [],
        title: "",
        message: "",
    });

    const [errors, setErrors] = useState({});

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCommonFormData((prev) => {
            let updatedTypes = [...prev.userType];
            if (checked) {
                updatedTypes.push(name);
            } else {
                updatedTypes = updatedTypes.filter((type) => type !== name);
            }
            return { ...prev, userType: updatedTypes };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCommonFormData((prev) => ({ ...prev, [name]: value }));
        if (!!errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const resetForm = () => {
        setCommonFormData({
            userType: [],
            title: "",
            message: "",
        });
        setErrors({});
    };

    const handleCancelClick = () => {
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { userType, title, message } = commonFormData;

        if (userType.length === 0 || !title || !message) {
            toast.error("Please fill all required fields");
            return;
        }

        const userTypeString = userType.join(",");
        const dataStored = JSON.parse(sessionStorage.getItem("data")) || {};

        try {
            const result = await addNotificationAPI({
                user_id: dataStored?.user_id || "",
                auth_key: dataStored?.auth_key || "",
                user_type: userTypeString,
                title,
                message,
            });

            if (result.status === "success") {
                toast.success("Notification added successfully!");
                resetForm();
            } else {
                toast.error(result.message || "Failed to add notification");
            }
        } catch (error) {
            toast.error("Something went wrong while saving notification");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
                {/* User Type */}
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    User Type
                </Typography>
                <FormGroup sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="master"
                                checked={commonFormData.userType.includes("master")}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Master"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="broker"
                                checked={commonFormData.userType.includes("broker")}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Broker"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="user"
                                checked={commonFormData.userType.includes("user")}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="User"
                    />
                </FormGroup>

                {/* Title */}
                <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>Title</Typography>
                <TextField
                    required
                    name="title"
                    value={commonFormData.title}
                    onChange={handleChange}
                    placeholder="Enter Title"
                    fullWidth
                    size="small"
                    sx={{ mb: 3 }}
                />

                {/* Message */}
                <Typography sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}>
                    Message
                </Typography>
                <TextField
                    required
                    name="message"
                    value={commonFormData.message}
                    onChange={handleChange}
                    placeholder="Enter Message"
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    sx={{ mb: 3 }}
                />

                {/* Buttons */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                    }}
                >
                    <Button
                        type="button"
                        variant="contained"
                        size="small"
                        sx={{
                            bgcolor: "error.main",
                            "&:hover": { bgcolor: "error.dark" },
                            textTransform: "none",
                        }}
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        sx={{
                            bgcolor: "primary.main",
                            "&:hover": { bgcolor: "primary.dark" },
                            textTransform: "none",
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </form>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </>
    );
};

export default Notificationn;