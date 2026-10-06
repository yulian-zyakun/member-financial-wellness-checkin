<?php

use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\FinancialCheckInController;
use Illuminate\Support\Facades\Route;

Route::apiResource('tasks', TaskController::class);

Route::apiResource('financial-check-ins', FinancialCheckInController::class);
