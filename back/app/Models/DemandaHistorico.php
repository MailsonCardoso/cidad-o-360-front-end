<?php



namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandaHistorico extends Model
{
    use HasFactory;

    protected $fillable = ['demanda_id', 'user_id', 'status', 'descricao'];

    public function demanda()
    {
        return $this->belongsTo(Demanda::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
