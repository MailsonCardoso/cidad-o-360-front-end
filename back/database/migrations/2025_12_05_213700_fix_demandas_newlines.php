<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        // Fix all demandas with escaped newlines in description
        $demandas = DB::table('demandas')->get();

        foreach ($demandas as $demanda) {
            if ($demanda->descricao && strpos($demanda->descricao, '\\n') !== false) {
                $fixedDescription = str_replace('\\n', "\n", $demanda->descricao);

                DB::table('demandas')
                    ->where('id', $demanda->id)
                    ->update(['descricao' => $fixedDescription]);

                echo "Fixed demanda ID: {$demanda->id}\n";
            }
        }

        echo "Migration completed!\n";
    }

    public function down()
    {
        // Cannot reliably reverse this
    }
};
