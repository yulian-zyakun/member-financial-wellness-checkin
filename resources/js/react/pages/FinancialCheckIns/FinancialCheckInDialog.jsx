import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { api } from "../../lib/api";

const formInit = {
    check_in_date: "",
    income: "",
    housing_expenses: "",
    food_expenses: "",
    transportation: "",
    debt_payments: "",
    savings: "",
};

export default function FinancialCheckInDialog({ open, onClose, checkIn }) {
    const [form, setForm] = useState(formInit);

    useEffect(() => {
        if (!checkIn) {
            return;
        }

        setForm({
            check_in_date: checkIn.check_in_date.slice(0, 7),
            income: checkIn.income / 100,
            housing_expenses: checkIn.housing_expenses / 100,
            food_expenses: checkIn.food_expenses / 100,
            transportation: checkIn.transportation / 100,
            debt_payments: checkIn.debt_payments / 100,
            savings: checkIn.savings / 100,
        });
    }, [checkIn]);

    const [error, setError] = useState("");

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data) => {
            if (checkIn) {
                return api.updateFinancialCheckIn(checkIn.id, data);
            }

            return api.createFinancialCheckIn(data);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["financial-check-ins"],
            });

            setForm(formInit);
            onClose();
        },

        onError: (error) => {
            if (error?.data?.errors?.check_in_date) {
                setError("A financial check-in for this month already exists.");
                return;
            }

            setError("Unable to save the financial check-in. Please try again.");
        },
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const convertToCents = (value) => {
        return Math.round(Number(value) * 100);
    };

    const handleSubmit = () => {
        const hasEmptyField = Object.values(form).some((value) => value === "");

        if (hasEmptyField) {
            setError("Please complete all fields.");
            return;
        }

        const data = {
            check_in_date: `${form.check_in_date}-01`,
            income: convertToCents(form.income),
            housing_expenses: convertToCents(form.housing_expenses),
            food_expenses: convertToCents(form.food_expenses),
            transportation: convertToCents(form.transportation),
            debt_payments: convertToCents(form.debt_payments),
            savings: convertToCents(form.savings),
        };

        mutation.mutate(data);
    };

    const handleClose = () => {
        setError("");
        setForm(formInit);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{checkIn ? "Edit Financial Check-In" : "New Financial Check-In"}</DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        pt: 1,
                    }}
                >
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <TextField
                        label="Month"
                        name="check_in_date"
                        type="month"
                        value={form.check_in_date}
                        onChange={handleChange}
                        fullWidth
                        required
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                    <TextField
                        label="Monthly Income"
                        name="income"
                        type="number"
                        value={form.income}
                        onChange={handleChange}
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                step: "0.01",
                            },
                        }}
                        fullWidth
                    />

                    <TextField
                        label="Housing"
                        name="housing_expenses"
                        type="number"
                        value={form.housing_expenses}
                        onChange={handleChange}
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                step: "0.01",
                            },
                        }}
                        fullWidth
                    />

                    <TextField
                        label="Food"
                        name="food_expenses"
                        type="number"
                        value={form.food_expenses}
                        onChange={handleChange}
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                step: "0.01",
                            },
                        }}
                        fullWidth
                    />

                    <TextField
                        label="Transportation"
                        name="transportation"
                        type="number"
                        value={form.transportation}
                        onChange={handleChange}
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                step: "0.01",
                            },
                        }}
                        fullWidth
                    />

                    <TextField
                        label="Debt Payments"
                        name="debt_payments"
                        type="number"
                        value={form.debt_payments}
                        onChange={handleChange}
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                step: "0.01",
                            },
                        }}
                        fullWidth
                    />

                    <TextField
                        label="Savings"
                        name="savings"
                        type="number"
                        value={form.savings}
                        onChange={handleChange}
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                step: "0.01",
                            },
                        }}
                        fullWidth
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>

                <Button variant="contained" onClick={handleSubmit} disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : checkIn ? "Update Check-In" : "Save Check-In"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
