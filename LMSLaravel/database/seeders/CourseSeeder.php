<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $instructors = User::where("role", "instructor")->get();
        $categories = CourseCategory::all();

        $courses = [
            [
                "title" => "Full-Stack Laravel React",
                "description" => "Build modern web apps with Laravel and React",
                "rating" => 8.9,
                "thumbnail" => "course.jpg",
                "level" => "intermediate",
                "duration" => 1200,
                "status" => "published",
                "enrolled_count" => 156,
            ],
            [
                "title" => "Flutter Mobile Development",
                "description" => "Build cross-platform mobile apps with Flutter",
                "rating" => 9.2,
                "thumbnail" => "flutter.jpg",
                "level" => "beginner",
                "duration" => 900,
                "status" => "published",
                "enrolled_count" => 234,
            ],
            [
                "title" => "Python for Data Science",
                "description" => "Learn Python programming for data analysis",
                "rating" => 8.5,
                "thumbnail" => "python.jpg",
                "level" => "beginner",
                "duration" => 600,
                "status" => "draft",
                "enrolled_count" => 89,
            ],
            [
                "title" => "Docker & Kubernetes",
                "description" => "Master containerization and orchestration",
                "rating" => 9.0,
                "thumbnail" => "docker.jpg",
                "level" => "advanced",
                "duration" => 800,
                "status" => "published",
                "enrolled_count" => 67,
            ],
            [
                "title" => "Figma for Beginners",
                "description" => "Learn UI/UX design with Figma",
                "rating" => 8.7,
                "thumbnail" => "figma.jpg",
                "level" => "beginner",
                "duration" => 400,
                "status" => "draft",
                "enrolled_count" => 123,
            ],
        ];

        foreach ($courses as $index => $course) {
            $course["instructor_id"] = $instructors[$index % $instructors->count()]->id;
            $course["category_id"] = $categories[$index % $categories->count()]->id;
            Course::create($course);
        }
    }
}
