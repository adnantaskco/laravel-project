<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NidCard extends Model
{
    protected $fillable = [
        'nid_number',
        'name',
        'date_of_birth',
        'father_name',
        'mother_name',
        'address',
        'photo',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];
}