<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demanda extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'categoria',
        'assunto',
        'descricao',
        'arquivo',
        'status',
        'protocolo',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function historico()
    {
        return $this->hasMany(DemandaHistorico::class)->orderBy('created_at', 'desc');
    }
}
