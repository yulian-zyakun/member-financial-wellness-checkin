import { Paper, Stack, Typography } from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function FinancialCheckInCharts({ financialCheckIns, formatMonthYear }) {
    if (financialCheckIns.length < 2) {
        return null;
    }

    const chartData = [...financialCheckIns]
        .sort((a, b) => a.check_in_date.localeCompare(b.check_in_date))
        .map((checkIn) => ({
            month: formatMonthYear(checkIn.check_in_date),
            income: checkIn.income / 100,
            totalExpenses: checkIn.metrics.total_expenses / 100,
            remaining: checkIn.metrics.remaining / 100,
            savingsRate: checkIn.metrics.savings_rate,
            debtToIncome: checkIn.metrics.debt_to_income_ratio,
        }));

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-CA", {
            style: "currency",
            currency: "CAD",
            maximumFractionDigits: 0,
        }).format(value);

    const formatPercent = (value) => `${value.toFixed(1)}%`;

    return (
        <Stack spacing={3} sx={{ mb: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Financial Check-In Chart
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    How your income, expenses, and remaining money have changed over time.
                </Typography>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ left: 20, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" padding={{ left: 40, right: 40 }} />

                        <YAxis tickFormatter={formatCurrency} />

                        <Tooltip formatter={(value) => formatCurrency(value)} />

                        <Legend />

                        <Line type="monotone" dataKey="income" name="Income" stroke="#1976d2" strokeWidth={2} dot />

                        <Line
                            type="monotone"
                            dataKey="totalExpenses"
                            name="Total Expenses"
                            stroke="#d32f2f"
                            strokeWidth={2}
                            dot
                        />

                        <Line
                            type="monotone"
                            dataKey="remaining"
                            name="Remaining"
                            stroke="#2e7d32"
                            strokeWidth={2}
                            dot
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Financial Check-In Rates Dynamic
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    How your savings rate and debt-to-income ratio are trending.
                </Typography>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ left: 20, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" padding={{ left: 40, right: 40 }} />

                        <YAxis tickFormatter={formatPercent} />

                        <Tooltip formatter={(value) => formatPercent(value)} />

                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="savingsRate"
                            name="Savings Rate"
                            stroke="#7b1fa2"
                            strokeWidth={2}
                            dot
                        />

                        <Line
                            type="monotone"
                            dataKey="debtToIncome"
                            name="Debt-to-Income"
                            stroke="#ed6c02"
                            strokeWidth={2}
                            dot
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Stack>
    );
}
