<?php

namespace Database\Seeders;

use App\Models\Assignment;
use Illuminate\Database\Seeder;

class AssignmentSeeder extends Seeder
{
    public function run(): void
    {
        $assignments = [
            [
                'title' => 'Design System Documentation & Tokens',
                'course_title' => 'UI/UX Fundamentals',
                'due_date' => '2026-08-01',
                'status' => 'PENDING',
                'max_points' => 100,
                'instructions' => 'Create a foundational design system style guide featuring color palettes, typography scale, and button component tokens.',
            ],
            [
                'title' => 'React Custom Hooks & State Management',
                'course_title' => 'Advanced React Architecture',
                'due_date' => '2026-08-05',
                'status' => 'SUBMITTED',
                'max_points' => 100,
                'grade' => 95,
                'submission' => 'https://github.com/example/react-hooks-submission',
                'instructions' => 'Implement custom hooks for data fetching with retry capabilities and optimistic updates.',
            ],
            [
                'title' => 'Database Schema Migration & Seeding',
                'course_title' => 'Fullstack Laravel Development',
                'due_date' => '2026-08-10',
                'status' => 'GRADED',
                'max_points' => 100,
                'grade' => 88,
                'submission' => 'https://github.com/example/laravel-migration-submission',
                'instructions' => 'Create database migrations and seeders for course, category, user, and assignment models.',
            ],
        ];

        foreach ($assignments as $data) {
            Assignment::create($data);
        }
    }
}
