<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\CourseCategoryResource;
use App\Models\CourseCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseCategoryController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $categories = CourseCategoryResource::collection(CourseCategory::all());

        return $this->collectionResponse(
            $categories,
            "Data kategori berhasil diambil",
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            "name" => "required|string|max:100|unique:course_categories,name",
            "description" => "nullable|string",
            "icon" => "nullable|string",
        ]);

        $category = CourseCategory::create($validated);

        return $this->created(
            new CourseCategoryResource($category),
            "Kategori berhasil dibuat",
        );
    }

    public function show($id): JsonResponse
    {
        $category = CourseCategory::with("courses")->findOrFail($id);

        return $this->resourceResponse(
            new CourseCategoryResource($category),
            "Data kategori berhasil diambil",
        );
    }

    public function update(Request $request, $id): JsonResponse
    {
        $category = CourseCategory::findOrFail($id);

        $validated = $request->validate([
            "name" => "sometimes|string|max:100|unique:course_categories,name," . $id,
            "description" => "nullable|string",
            "icon" => "nullable|string",
        ]);

        $category->update($validated);

        return $this->resourceResponse(
            new CourseCategoryResource($category),
            "Kategori berhasil diperbarui",
        );
    }

    public function destroy($id): JsonResponse
    {
        $category = CourseCategory::findOrFail($id);

        if ($category->courses()->count() > 0) {
            return $this->error(
                "Tidak dapat menghapus kategori yang memiliki kursus",
                400,
            );
        }

        $category->delete();

        return $this->success(null, "Kategori berhasil dihapus");
    }
}
