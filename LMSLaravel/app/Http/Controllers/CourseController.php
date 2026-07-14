<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CourseController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Course::with(["category", "instructor"]);

        if ($search = $request->query("search")) {
            $query->where("title", "like", "%{$search}%");
        }

        if ($categoryId = $request->query("category_id")) {
            $query->where("category_id", $categoryId);
        }

        if ($level = $request->query("level")) {
            $query->where("level", $level);
        }

        $sortBy = $request->query("sort_by");
        $order = $request->query("order", "desc");

        $allowedSorts = ["rating", "enrolled_count", "duration", "created_at", "title"];

        if ($sortBy && in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $order === "asc" ? "asc" : "desc");
        }

        $courses = CourseResource::collection($query->get());

        return $this->collectionResponse(
            $courses,
            "Data kursus berhasil diambil",
        );
    }

    public function show($id): JsonResponse
    {
        $course = Course::with(["category", "instructor"])->findOrFail($id);

        return $this->resourceResponse(
            new CourseResource($course),
            "Data kursus berhasil diambil",
        );
    }

    public function store(Request $request): JsonResponse
    {
        Gate::authorize("create", Course::class);

        $validated = $request->validate([
            "title" => "required|string|max:255",
            "description" => "required|string",
            "rating" => "required|numeric|min:0|max:10",
            "category_id" => "required|exists:course_categories,id",
            "level" => "required|in:beginner,intermediate,advanced",
            "duration" => "required|integer|min:1",
            "thumbnail" => "nullable|string",
            "status" => "in:draft,published",
        ]);

        $validated["instructor_id"] = $request->user()->id;

        $course = Course::create($validated);
        $course->load(["category", "instructor"]);

        return $this->created(
            new CourseResource($course),
            "Kursus berhasil dibuat",
        );
    }

    public function update(Request $request, $id): JsonResponse
    {
        $course = Course::findOrFail($id);
        Gate::authorize("update", $course);

        $validated = $request->validate([
            "title" => "sometimes|string|max:255",
            "description" => "sometimes|string",
            "rating" => "sometimes|numeric|min:0|max:10",
            "category_id" => "sometimes|exists:course_categories,id",
            "level" => "sometimes|in:beginner,intermediate,advanced",
            "duration" => "sometimes|integer|min:1",
            "thumbnail" => "nullable|string",
            "status" => "in:draft,published",
        ]);

        $course->update($validated);
        $course->load(["category", "instructor"]);

        return $this->resourceResponse(
            new CourseResource($course),
            "Kursus berhasil diperbarui",
        );
    }

    public function destroy($id): JsonResponse
    {
        $course = Course::findOrFail($id);
        Gate::authorize("delete", $course);

        $course->delete();

        return $this->success(null, "Kursus berhasil dihapus");
    }
}
