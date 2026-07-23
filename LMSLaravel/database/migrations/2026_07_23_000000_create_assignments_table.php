<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('course_title');
            $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('cascade');
            $table->date('due_date');
            $table->enum('status', ['PENDING', 'SUBMITTED', 'GRADED'])->default('PENDING');
            $table->integer('max_points')->default(100);
            $table->text('instructions');
            $table->integer('grade')->nullable();
            $table->text('submission')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
