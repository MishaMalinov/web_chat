<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    
    protected $fillable = [
        'file_path',
        'file_type',
    ];

    
}
