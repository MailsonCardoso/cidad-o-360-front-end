<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DemandaController;
use App\Http\Controllers\ComunicadoController;
use App\Http\Controllers\UserController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/demandas', [DemandaController::class, 'store']); // Public creation endpoint
Route::get('/consultar/{protocolo}', [DemandaController::class, 'search']); // Public search endpoint
Route::post('/demandas/{id}/rate', [DemandaController::class, 'rate']); // Public rating endpoint

// Public Comunicados routes
Route::get('/comunicados', [ComunicadoController::class, 'index']);
Route::get('/comunicados/{id}', [ComunicadoController::class, 'show']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Demanda CRUD
    // Demanda CRUD (except store which is public)
    Route::apiResource('demandas', DemandaController::class)->except(['store']);
    Route::post('/admin/demandas', [DemandaController::class, 'store']); // Internal creation endpoint
    Route::get('/dashboard/stats', [DemandaController::class, 'stats']);

    // Comunicado CRUD (Admin only write access)
    Route::post('/comunicados', [ComunicadoController::class, 'store']);
    Route::put('/comunicados/{id}', [ComunicadoController::class, 'update']);
    Route::delete('/comunicados/{id}', [ComunicadoController::class, 'destroy']);

    // User CRUD (Admin)
    Route::apiResource('users', UserController::class);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
