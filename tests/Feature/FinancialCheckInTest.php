<?php

namespace Tests\Feature;

use App\Models\FinancialCheckIn;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinancialCheckInTest extends TestCase
{
    use RefreshDatabase;

    // Verifies that a valid financial check-in can be created and stored.
    public function test_create_financial_check_in(): void
    {
        $response = $this->postJson('/api/financial-check-ins', [
            'check_in_date' => '2026-10-01',
            'income' => 500000,
            'housing_expenses' => 150000,
            'food_expenses' => 60000,
            'transportation' => 40000,
            'debt_payments' => 50000,
            'savings' => 10000,
        ]);

        $response
            ->assertCreated()
            ->assertJsonFragment([
                'income' => 500000,
            ]);

        $this->assertDatabaseHas('financial_check_ins', [
            'check_in_date' => '2026-10-01 00:00:00',
            'income' => 500000,
        ]);
    }

    // Verifies that all required fields are validated before saving.
    public function test_validate_required_fields(): void
    {
        $response = $this->postJson('/api/financial-check-ins', []);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'check_in_date',
                'income',
                'housing_expenses',
                'food_expenses',
                'transportation',
                'debt_payments',
                'savings',
            ]);

        $this->assertDatabaseCount('financial_check_ins', 0);
    }

    // Verifies that the database prevents multiple check-ins for the same month.
    public function test_reject_duplicate_check_in_month(): void
    {
        FinancialCheckIn::create([
            'check_in_date' => '2026-10-01',
            'income' => 500000,
            'housing_expenses' => 150000,
            'food_expenses' => 60000,
            'transportation' => 40000,
            'debt_payments' => 50000,
            'savings' => 10000,
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        FinancialCheckIn::create([
            'check_in_date' => '2026-10-01',
            'income' => 600000,
            'housing_expenses' => 150000,
            'food_expenses' => 60000,
            'transportation' => 40000,
            'debt_payments' => 50000,
            'savings' => 12000,
        ]);
    }

    // Verifies that financial metrics are calculated and returned correctly.
    public function test_return_calculated_metrics(): void
    {
        $response = $this->postJson('/api/financial-check-ins', [
            'check_in_date' => '2026-10-01',
            'income' => 500000,
            'housing_expenses' => 150000,
            'food_expenses' => 60000,
            'transportation' => 40000,
            'debt_payments' => 50000,
            'savings' => 100000,
        ]);

        $response->assertCreated();

        $checkIn = FinancialCheckIn::first();

        $response = $this->getJson(
            "/api/financial-check-ins/{$checkIn->id}"
        );

        $response
            ->assertOk()
            ->assertJsonPath('metrics.total_expenses', 300000)
            ->assertJsonPath('metrics.remaining', 100000)
            ->assertJsonPath('metrics.savings_rate', 20)
            ->assertJsonPath('metrics.debt_to_income_ratio', 10);
    }

    // Verifies that an existing financial check-in can be updated.
    public function test_update_financial_check_in(): void
    {
        $checkIn = FinancialCheckIn::create([
            'check_in_date' => '2026-10-01',
            'income' => 500000,
            'housing_expenses' => 150000,
            'food_expenses' => 60000,
            'transportation' => 40000,
            'debt_payments' => 50000,
            'savings' => 10000,
        ]);

        $response = $this->patchJson(
            "/api/financial-check-ins/{$checkIn->id}",
            [
                'check_in_date' => '2026-10-01',
                'income' => 600000,
                'housing_expenses' => 160000,
                'food_expenses' => 70000,
                'transportation' => 50000,
                'debt_payments' => 60000,
                'savings' => 12000,
            ]
        );

        $response
            ->assertOk()
            ->assertJsonFragment([
                'income' => 600000,
            ]);

        $this->assertDatabaseHas('financial_check_ins', [
            'id' => $checkIn->id,
            'income' => 600000,
            'savings' => 12000,
        ]);
    }

    // Verifies that an existing financial check-in can be deleted.
    public function test_delete_financial_check_in(): void
    {
        $checkIn = FinancialCheckIn::create([
            'check_in_date' => '2026-10-01',
            'income' => 500000,
            'housing_expenses' => 150000,
            'food_expenses' => 60000,
            'transportation' => 40000,
            'debt_payments' => 50000,
            'savings' => 10000,
        ]);

        $response = $this->deleteJson(
            "/api/financial-check-ins/{$checkIn->id}"
        );

        $response->assertNoContent();

        $this->assertDatabaseMissing('financial_check_ins', [
            'id' => $checkIn->id,
        ]);
    }
}
