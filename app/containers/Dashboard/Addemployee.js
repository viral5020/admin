import React, { useState, useEffect } from "react";
import {
    Typography,
    Grid,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { fetchPermissionsAPI, getemployeeDetailsAPI, saveEmployee } from "./API/API";
import { useLocation } from "react-router-dom";

const Addemployee = () => {
    const location = useLocation();
    const { userId: editUserId } = location.state || {};
    const [isEditMode, setIsEditMode] = useState(false);

    const [commonFormData, setCommonFormData] = useState({
        name: "",
        password: "",
        remarks: "",
        permissions: {},
    });

    const [permissionList, setPermissionList] = useState([]);
    const [errors, setErrors] = useState({});

    // Fetch employee details if edit mode
    async function getUserDataForEdit() {
        try {
            const response = await getemployeeDetailsAPI(editUserId);
            if (response?.status === "ok") {
                const user = response.data;

                const userPermissions = {};
                user.selected_permission.forEach((perm) => {
                    userPermissions[perm.permission_name] = perm.selected;
                });

                setCommonFormData((prev) => ({
                    ...prev,
                    name: user.user_name || "",
                    remarks: user.remarks || "",
                    permissions: { ...prev.permissions, ...userPermissions },
                }));

                setIsEditMode(true);
            } else {
                toast.error("Failed to load employee details");
            }
        } catch (error) {
            console.error("Error fetching employee details:", error);
            toast.error("Something went wrong while fetching employee details");
        }
    }

    useEffect(() => {
        if (editUserId) {
            getUserDataForEdit();
        }
    }, [editUserId]);

    // Fetch permission list
    useEffect(() => {
        const getPermissions = async () => {
            try {
                const permissions = await fetchPermissionsAPI();
                setPermissionList(permissions);

                const initialPermissions = {};
                permissions.forEach((perm) => {
                    initialPermissions[perm.permission_name] =
                        commonFormData.permissions[perm.permission_name] ??
                        (perm.selected || false);
                });

                setCommonFormData((prev) => ({
                    ...prev,
                    permissions: initialPermissions,
                }));
            } catch (err) {
                toast.error("Failed to load permissions");
            }
        };

        getPermissions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCommonFormData((prev) => ({ ...prev, [name]: value }));
        if (!!errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handlePermissionChange = (e) => {
        const { name, checked } = e.target;
        setCommonFormData((prev) => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [name]: checked,
            },
        }));
    };

    const resetForm = () => {
        setCommonFormData((prev) => ({
            name: "",
            password: "",
            remarks: "",
            permissions: Object.fromEntries(
                Object.keys(prev.permissions).map((key) => [key, false])
            ),
        }));
        setErrors({});
    };

    const handleCancelClick = () => {
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, password, remarks, permissions } = commonFormData;

        // --- Validation ---
        if (!name || (!isEditMode && !password)) {
            return toast.error("Please fill all required fields");
        }

        const selectedPermissions = Object.keys(permissions).filter(
            (key) => permissions[key]
        );
        if (selectedPermissions.length === 0) {
            return toast.error("Please select at least one permission");
        }

        // --- API Call ---
        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data")) || {};
            const response = await saveEmployee(commonFormData, dataStored, isEditMode, editUserId);

            if (response.data.status === "success") {
                toast.success(
                    isEditMode
                        ? "Employee updated successfully!"
                        : "Employee added successfully!"
                );
                resetForm();
            } else {
                toast.error(response.data.message || "Failed to save employee");
            }
        } catch (error) {
            console.error("❌ API Error:", error);
            toast.error("Something went wrong while saving employee");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
                {/* Basic Details */}
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Basic Details
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    {/* Name */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                            Name
                        </Typography>
                        <TextField
                            required
                            name="name"
                            value={commonFormData.name}
                            onChange={handleChange}
                            placeholder="Enter Name"
                            fullWidth
                            size="small"
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>

                    {/* Password (only for create mode) */}
                    {!isEditMode && (
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                                Password
                            </Typography>
                            <TextField
                                required
                                type="password"
                                name="password"
                                value={commonFormData.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                fullWidth
                                size="small"
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                        </Grid>
                    )}
                </Grid>

                {/* Permission Section */}
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Permission
                </Typography>
                <FormGroup sx={{ mb: 2 }}>
                    {permissionList.map((perm) => (
                        <FormControlLabel
                            key={perm.permission_name}
                            control={
                                <Checkbox
                                    name={perm.permission_name}
                                    checked={
                                        commonFormData.permissions[perm.permission_name] || false
                                    }
                                    onChange={handlePermissionChange}
                                />
                            }
                            label={perm.permission_name}
                        />
                    ))}
                </FormGroup>

                {/* Remarks */}
                <Typography
                    sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}
                >
                    Remarks
                </Typography>
                <TextField
                    name="remarks"
                    value={commonFormData.remarks}
                    onChange={(e) => {
                        setCommonFormData((prev) => ({
                            ...prev,
                            remarks: e.target.value,
                        }));
                        handleChange(e);
                    }}
                    placeholder="Remarks"
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
                        {isEditMode ? "Update" : "Submit"}
                    </Button>
                </div>
            </form>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </>
    );
};

export default Addemployee;
