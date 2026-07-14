<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    protected $fillable = [
        "instructor_id",
        "category_id",
        "title",
        "description",
        "rating",
        "thumbnail",
        "level",
        "duration",
        "status",
        "enrolled_count",
    ];

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, "instructor_id");
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, "category_id");
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }
}
