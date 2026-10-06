<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFinancialCheckInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'check_in_date' => [
                'required',
                'date',
                'date_format:Y-m-d',
                Rule::unique('financial_check_ins', 'check_in_date')->ignore($this->route('financial_check_in'))
            ],
            'income' => ['required', 'integer', 'min:0'],
            'housing_expenses' => ['required', 'integer', 'min:0'],
            'food_expenses' => ['required', 'integer', 'min:0'],
            'transportation' => ['required', 'integer', 'min:0'],
            'debt_payments' => ['required', 'integer', 'min:0'],
            'savings' => ['required', 'integer', 'min:0'],
        ];
    }
}
