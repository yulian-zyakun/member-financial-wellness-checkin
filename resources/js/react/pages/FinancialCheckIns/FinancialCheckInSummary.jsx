import { Box, Paper, Typography } from "@mui/material";

export default function FinancialCheckInSummary({ financialCheckIn, formatMoney, formatMonthYear }) {
    if (!financialCheckIn) {
        return null;
    }

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Latest Check-In — {formatMonthYear(financialCheckIn.check_in_date)}
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, 1fr)",
                    },
                    gap: 3,
                }}
            >
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Income
                    </Typography>

                    <Typography variant="h5">{formatMoney(financialCheckIn.income)}</Typography>
                </Box>

                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Total Expenses
                    </Typography>

                    <Typography variant="h5">{formatMoney(financialCheckIn.metrics.total_expenses)}</Typography>
                </Box>

                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Remaining
                    </Typography>

                    <Typography variant="h5">{formatMoney(financialCheckIn.metrics.remaining)}</Typography>
                </Box>

                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Savings Rate
                    </Typography>

                    <Typography variant="h5">{financialCheckIn.metrics.savings_rate.toFixed(1)}%</Typography>
                </Box>

                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Debt-To-Income Ratio
                    </Typography>

                    <Typography variant="h5">{financialCheckIn.metrics.debt_to_income_ratio.toFixed(1)}%</Typography>
                </Box>
            </Box>
        </Paper>
    );
}
