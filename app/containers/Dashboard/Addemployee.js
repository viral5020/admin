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
import { fetchPermissionsAPI } from "./API/API";

const Addemployee = () => {
    const [commonFormData, setCommonFormData] = useState({
        name: "",
        password: "",
        permissions: {},
        remarks: "",
    });
    const [permissionList, setPermissionList] = useState([]); // from API
    const [errors, setErrors] = useState({});

    // Fetch permissions from API
    useEffect(() => {
        const getPermissions = async () => {
            try {
                const permissions = await fetchPermissionsAPI();
                setPermissionList(permissions);

                // Initialize permissions state
                const initialPermissions = {};
                permissions.forEach((perm) => {
                    initialPermissions[perm.permission_name] = perm.selected || false;
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

        // Validate required fields
        if (!name || !password) {
            toast.error("Please fill all required fields");
            return;
        }

        // Convert permissions object to array of selected IDs
        const selectedPermissions = Object.keys(permissions).filter(
            (key) => permissions[key]
        );

        // Validate that at least one permission is selected
        if (selectedPermissions.length === 0) {
            toast.error("Please select at least one permission");
            return;
        }

        // Convert array to comma-separated string
        const permissionString = selectedPermissions.join(",");

        // Get session data
        const dataStored = JSON.parse(sessionStorage.getItem("data")) || {};

        const payload = {
            is_app: 1,
            login_user_id: dataStored?.user_id || "",
            auth_key: dataStored?.auth_key || "",
            name,
            password,
            remarks,
            empPermission: permissionString, // send as comma-separated string
        };

        try {
            const response = await axios.post(
                "http://128.199.126.171/~goldorg/ajaxfiles/create_employee",
                payload
            );

            if (response.data.status === "success") {
                toast.success("Employee added successfully!");
                resetForm();
            } else {
                toast.error(response.data.message || "Failed to add employee");
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error("Something went wrong while adding employee");
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
                        <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>Name</Typography>
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

                    {/* Password */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>Password</Typography>
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
                                    checked={commonFormData.permissions[perm.permission_name] || false}
                                    onChange={handlePermissionChange}
                                />
                            }
                            label={perm.permission_name}
                        />
                    ))}
                </FormGroup>

                {/* Remarks */}
                <Typography sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}>
                    Remarks
                </Typography>
                <TextField
                    name="remarks"
                    value={commonFormData.remarks}
                    onChange={(e) => {
                        setCommonFormData((prev) => ({ ...prev, remarks: e.target.value }));
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
                        Submit
                    </Button>
                </div>
            </form>

            {/* Toast container */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </>
    );
};

export default Addemployee;
