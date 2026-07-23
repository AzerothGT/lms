<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssignmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'course_title' => $this->course_title,
            'course_id' => $this->course_id,
            'due_date' => $this->due_date,
            'status' => $this->status,
            'max_points' => $this->max_points,
            'instructions' => $this->instructions,
            'grade' => $this->grade,
            'submission' => $this->submission,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
