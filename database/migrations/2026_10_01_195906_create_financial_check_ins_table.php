<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_check_ins', function (Blueprint $table) {
            $table->id();
            $table->date('check_in_date')->unique();
            $table->unsignedInteger('income');
            $table->unsignedInteger('housing_expenses');
            $table->unsignedInteger('food_expenses');
            $table->unsignedInteger('transportation');
            $table->unsignedInteger('debt_payments');
            $table->unsignedInteger('savings');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_check_ins');
    }
};
