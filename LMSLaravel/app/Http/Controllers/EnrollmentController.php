<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\EnrollmentResource;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $enrollments = EnrollmentResource::collection(
            Enrollment::with(["user", "course"])->get()
        );

        return $this->collectionResponse($enrollments, "Data pendaftaran berhasil diambil");
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            "user_id" => "required|exists:users,id",
            "course_id" => "required|exists:courses,id",
            "enrolled_at" => "required|date",
        ]);

        $enrollment = Enrollment::create($validated);
        $enrollment->load(["user", "course"]);

        return $this->created(new EnrollmentResource($enrollment), "Pendaftaran berhasil dibuat");
    }

    public function show(Enrollment $enrollment): JsonResponse
    {
        $enrollment->load(["user", "course"]);

        return $this->resourceResponse(new EnrollmentResource($enrollment), "Data pendaftaran berhasil diambil");
    }

    public function update(Request $request, Enrollment $enrollment): JsonResponse
    {
        $validated = $request->validate([
            "user_id" => "sometimes|exists:users,id",
            "course_id" => "sometimes|exists:courses,id",
            "enrolled_at" => "sometimes|date",
        ]);

        $enrollment->update($validated);
        $enrollment->load(["user", "course"]);

        return $this->resourceResponse(new EnrollmentResource($enrollment), "Pendaftaran berhasil diperbarui");
    }

    public function destroy(Enrollment $enrollment): JsonResponse
    {
        $enrollment->delete();

        return $this->success(null, "Pendaftaran berhasil dihapus");
    }
}
