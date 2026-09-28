<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nid_cards', function (Blueprint $table) {
            $table->id();
            $table->string('nid_number')->unique();
            $table->string('name');
            $table->date('date_of_birth');
            $table->string('father_name');
            $table->string('mother_name');
            $table->text('address');
            $table->string('photo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nid_cards');
    }
};