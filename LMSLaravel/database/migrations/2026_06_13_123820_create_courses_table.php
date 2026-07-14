<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("courses", function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId("instructor_id")
                ->constrained("users")
                ->onDelete("cascade");
            $table
                ->foreignId("category_id")
                ->constrained("course_categories")
                ->onDelete("restrict");
            $table->string("title");
            $table->text("description");
            $table->decimal("rating", 4, 1)->default(0.0);
            $table->string("thumbnail")->nullable();
            $table
                ->enum("level", ["beginner", "intermediate", "advanced"])
                ->default("beginner");
            $table->integer("duration");
            $table->enum("status", ["draft", "published"])->default("draft");
            $table->integer("enrolled_count");
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("courses");
    }
};
