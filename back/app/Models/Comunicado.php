<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comunicado extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'resumo',
        'conteudo',
        'data_publicacao',
        'arquivo',
    ];

    protected $casts = [
        'data_publicacao' => 'date',
    ];
}
