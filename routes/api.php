<?php

use App\Http\Controllers\NidCardController;
use Illuminate\Support\Facades\Route;

Route::apiResource('nid-cards', NidCardController::class);