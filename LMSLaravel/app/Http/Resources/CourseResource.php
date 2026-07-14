<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "title" => $this->title,
            "description" => $this->description,
            "rating" => $this->rating,
            "rating_class" => $this->getRatingClass(),
            "thumbnail" => $this->thumbnail,
            "level" => $this->level,
            "duration" => $this->duration,
            "enrolled_count" => $this->enrolled_count,
            "status" => $this->status,
            "category" => $this->whenLoaded("category", function () {
                return [
                    "id" => $this->category->id,
                    "name" => $this->category->name,
                ];
            }),
            "instructor" => $this->whenLoaded("instructor", function () {
                return [
                    "id" => $this->instructor->id,
                    "name" => $this->instructor->name,
                ];
            }),
        ];
    }

    private function getRatingClass(): string
    {
        if ($this->rating >= 8.5) {
            return "Top Rated";
        } elseif ($this->rating >= 7.0) {
            return "Recommended";
        }

        return "Regular";
    }
}
