<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\ChatController;

Route::post('register', [UserController::class, 'register']);
Route::post('login', [UserController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'getUser']);
Route::middleware('auth:sanctum')->get('/search-users', [UserController::class, 'search']);
Route::middleware('auth:sanctum')->post('/user-update', [UserController::class, 'update']);
Route::middleware('auth:sanctum')->post('/create-chat', [ChatController::class, 'createChat']);
