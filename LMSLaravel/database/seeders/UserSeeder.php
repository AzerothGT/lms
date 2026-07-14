<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $instructors = [
            ["name" => "Jane Instructor", "email" => "jane@example.com", "password" => bcrypt("password"), "role" => "instructor"],
            ["name" => "John Instructor", "email" => "john@example.com", "password" => bcrypt("password"), "role" => "instructor"],
            ["name" => "Emily Instructor", "email" => "emily@example.com", "password" => bcrypt("password"), "role" => "instructor"],
        ];

        $students = [
            ["name" => "Alice Student", "email" => "alice@example.com", "password" => bcrypt("password"), "role" => "student"],
            ["name" => "Bob Student", "email" => "bob@example.com", "password" => bcrypt("password"), "role" => "student"],
            ["name" => "Charlie Student", "email" => "charlie@example.com", "password" => bcrypt("password"), "role" => "student"],
            ["name" => "Diana Student", "email" => "diana@example.com", "password" => bcrypt("password"), "role" => "student"],
            ["name" => "Eve Student", "email" => "eve@example.com", "password" => bcrypt("password"), "role" => "student"],
        ];

        foreach ($instructors as $instructor) {
            User::create($instructor);
        }

        foreach ($students as $student) {
            User::create($student);
        }
    }
}
