<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialCheckIn extends Model
{
    protected $fillable = [
        'check_in_date',
        'income',
        'housing_expenses',
        'food_expenses',
        'transportation',
        'debt_payments',
        'savings',
    ];

    protected function casts(): array
    {
        return [
            'check_in_date' => 'date',
            'income' => 'integer',
            'housing_expenses' => 'integer',
            'food_expenses' => 'integer',
            'transportation' => 'integer',
            'debt_payments' => 'integer',
            'savings' => 'integer',
        ];
    }

    public function getMetrics(): array
    {
        $totalExpenses =
            $this->housing_expenses +
            $this->food_expenses +
            $this->transportation +
            $this->debt_payments;

        $remaining = $this->income - $totalExpenses - $this->savings;

        $savingsRate = $this->income > 0
            ? ($this->savings / $this->income) * 100
            : 0;

        $debtToIncomeRatio = $this->income > 0
            ? ($this->debt_payments / $this->income) * 100
            : 0;

        return [
            'total_expenses' => $totalExpenses,
            'remaining' => $remaining,
            'savings_rate' => $savingsRate,
            'debt_to_income_ratio' => $debtToIncomeRatio,
        ];
    }
}
