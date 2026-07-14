<?php

namespace Database\Seeders;

use App\Models\CourseCategory;
use Illuminate\Database\Seeder;

class CourseCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ["name" => "Web Development", "description" => "Learn to build web applications", "icon" => "globe"],
            ["name" => "Mobile Development", "description" => "Learn to build mobile apps", "icon" => "smartphone"],
            ["name" => "Data Science", "description" => "Learn data analysis and machine learning", "icon" => "chart-bar"],
            ["name" => "DevOps", "description" => "Learn deployment and infrastructure", "icon" => "server"],
            ["name" => "UI/UX Design", "description" => "Learn user interface and experience design", "icon" => "palette"],
        ];

        foreach ($categories as $category) {
            CourseCategory::create($category);
        }
    }
}
