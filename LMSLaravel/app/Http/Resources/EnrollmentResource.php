<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnrollmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "user" => [
                "id" => $this->user->id,
                "name" => $this->user->name,
            ],
            "course" => [
                "id" => $this->course->id,
                "title" => $this->course->title,
            ],
            "enrolled_at" => $this->enrolled_at,
        ];
    }
}
