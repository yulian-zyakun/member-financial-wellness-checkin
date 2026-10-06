<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFinancialCheckInRequest;
use App\Http\Requests\UpdateFinancialCheckInRequest;
use App\Models\FinancialCheckIn;
use Illuminate\Http\JsonResponse;

class FinancialCheckInController extends Controller
{
    public function index()
    {
        $financialCheckIns = FinancialCheckIn::orderByDesc('check_in_date')->get();

        return response()->json(
            $financialCheckIns->map(function ($financialCheckIn) {
                return [
                    ...$financialCheckIn->toArray(),
                    'metrics' => $financialCheckIn->getMetrics(),
                ];
            })
        );
    }

    public function store(StoreFinancialCheckInRequest $request)
    {
        $financialCheckIn = FinancialCheckIn::create($request->validated());

        return response()->json($financialCheckIn, 201);
    }

    public function show(FinancialCheckIn $financialCheckIn): JsonResponse
    {
        return response()->json([
            $financialCheckIn->toArray(),
            'metrics' => $financialCheckIn->getMetrics()
        ]);
    }

    public function update(UpdateFinancialCheckInRequest $request, FinancialCheckIn $financialCheckIn)
    {
        $financialCheckIn->update($request->validated());

        return response()->json($financialCheckIn);
    }

    public function destroy(FinancialCheckIn $financialCheckIn): JsonResponse
    {
        $financialCheckIn->delete();

        return response()->json(null, 204);
    }
}
