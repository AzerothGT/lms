<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CourseCategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post("/register", [AuthController::class, "register"]);
Route::post("/login", [AuthController::class, "login"])->name("login");

Route::middleware("auth:sanctum")->group(function () {
    Route::post("/logout", [AuthController::class, "logout"]);
    Route::get("/user", [AuthController::class, "user"]);
});

Route::middleware("auth:sanctum")->group(function () {
    Route::apiResource("courses", CourseController::class)
        ->except(["index", "show"])
        ->parameters(["courses" => "id"]);
    Route::apiResource(
        "categories",
        CourseCategoryController::class,
    )->parameters(["categories" => "id"]);
    Route::apiResource("users", UserController::class);
    Route::apiResource("enrollments", EnrollmentController::class);
});

Route::apiResource("courses", CourseController::class)->only(["index", "show"])->parameters(["courses" => "id"]);
