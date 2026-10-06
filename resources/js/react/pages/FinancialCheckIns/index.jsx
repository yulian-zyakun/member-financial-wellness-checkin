import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { api } from "../../lib/api";
import DeleteFinancialCheckInDialog from "./DeleteFinancialCheckInDialog";
import FinancialCheckInCharts from "./FinancialCheckInCharts";
import FinancialCheckInDialog from "./FinancialCheckInDialog";
import FinancialCheckInSummary from "./FinancialCheckInSummary";

const formatMonthYear = (date) => {
    const [year, month] = date.split("-");

    return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
};

const formatMoney = (cents) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CAD",
    }).format(cents / 100);
};

export default function FinancialCheckIns() {
    const [open, setDialogOpen] = useState(false);
    const [financialCheckInEdit, setFinancialCheckInEdit] = useState(null);
    const [financialCheckInDelete, setFinancialCheckInDelete] = useState(null);

    const {
        data: financialCheckIns = [],
        isPending,
        isError,
    } = useQuery({
        queryKey: ["financial-check-ins"],
        queryFn: api.getFinancialCheckIns,
    });

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id) => api.deleteFinancialCheckIn(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["financial-check-ins"],
            });

            setFinancialCheckInDelete(null);
        },
    });

    const handleDelete = () => {
        if (!financialCheckInDelete) {
            return;
        }

        deleteMutation.mutate(financialCheckInDelete.id);
    };

    const latestFinancialCheckIn = financialCheckIns[0];

    if (isPending) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Typography color="error" sx={{ pt: 4 }}>
                Failed to load Financial Check-Ins.
            </Typography>
        );
    }

    return (
        <Box>
            <Box
                sx={{
                    dispplay: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="h4">Financial Wellness Check-In</Typography>
                    <Typography color="text.secondary">Check your finances over time.</Typography>
                </Box>

                <Button
                    variant="contained"
                    onClick={() => {
                        setDialogOpen(true);
                        setFinancialCheckInEdit(null);
                    }}
                >
                    New Check-In
                </Button>
            </Box>

            <FinancialCheckInSummary
                financialCheckIn={latestFinancialCheckIn}
                formatMoney={formatMoney}
                formatMonthYear={formatMonthYear}
            />

            <FinancialCheckInCharts financialCheckIns={financialCheckIns} formatMonthYear={formatMonthYear} />

            <Typography variant="h6" sx={{ mb: 2 }}>
                Financial Check-In History
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Month Year</TableCell>
                            <TableCell>Income</TableCell>
                            <TableCell>Housing</TableCell>
                            <TableCell>Food</TableCell>
                            <TableCell>Transportation</TableCell>
                            <TableCell>Debt</TableCell>
                            <TableCell>Savings</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {financialCheckIns.map((checkIn) => (
                            <TableRow key={checkIn.id} hover>
                                <TableCell>{formatMonthYear(checkIn.check_in_date)}</TableCell>
                                <TableCell>{formatMoney(checkIn.income)}</TableCell>
                                <TableCell>{formatMoney(checkIn.housing_expenses)}</TableCell>
                                <TableCell>{formatMoney(checkIn.food_expenses)}</TableCell>
                                <TableCell>{formatMoney(checkIn.transportation)}</TableCell>
                                <TableCell>{formatMoney(checkIn.debt_payments)}</TableCell>
                                <TableCell>{formatMoney(checkIn.savings)}</TableCell>
                                <TableCell>
                                    <Button size="small" onClick={() => setFinancialCheckInEdit(checkIn)}>
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => setFinancialCheckInDelete(checkIn)}
                                        disabled={deleteMutation.isPending}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {financialCheckIns.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ color: "text.secondary", py: 4 }}>
                                    No Financial Check-Ins yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <FinancialCheckInDialog
                open={open || Boolean(financialCheckInEdit)}
                onClose={() => {
                    setDialogOpen(false);
                    setFinancialCheckInEdit(null);
                }}
                checkIn={financialCheckInEdit}
            />
            <DeleteFinancialCheckInDialog
                open={Boolean(financialCheckInDelete)}
                onClose={() => setFinancialCheckInDelete(null)}
                onConfirm={handleDelete}
                checkIn={financialCheckInDelete}
                formatMonthYear={formatMonthYear}
                isDeleting={deleteMutation.isPending}
            />
        </Box>
    );
}
