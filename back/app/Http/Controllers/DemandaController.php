<?php

namespace App\Http\Controllers;

use App\Models\Demanda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class DemandaController extends Controller
{
    public function index(Request $request)
    {
        $query = Demanda::query();

        if ($request->has('categoria')) {
            $query->where('categoria', $request->categoria);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('data_inicio') && $request->has('data_fim')) {
            $query->whereBetween('created_at', [$request->data_inicio, $request->data_fim]);
        }

        $demandas = $query->orderByRaw("
            CASE 
                WHEN status = 'Aberto' THEN 1
                WHEN status LIKE 'Encaminhada para%' THEN 2
                WHEN status = 'Em andamento' THEN 3
                WHEN status = 'Concluído' THEN 4
                ELSE 5
            END
        ")
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $demandas,
            'message' => 'Demandas listadas com sucesso'
        ]);
    }

    public function show($id)
    {
        $demanda = Demanda::with(['user', 'historico.user'])->find($id);

        if (!$demanda) {
            return response()->json(['success' => false, 'message' => 'Demanda não encontrada'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $demanda,
            'message' => 'Detalhes da demanda'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'categoria' => 'required',
            'assunto' => 'required|string',
            'descricao' => 'required|string',
            'cpf' => 'nullable|string',
            'arquivo' => 'nullable|file|max:10240', // 10MB
        ]);

        $path = null;
        if ($request->hasFile('arquivo')) {
            $path = $request->file('arquivo')->store('demandas', 'public');
        }

        $initialStatus = 'Aberto';
        $creator = $request->user();
        $ownerId = $creator?->id;

        // Logic to determine if the demand belongs to the user or is being created on behalf of someone else
        // If the logged in user is Staff (Admin/Atendimento), they are registering for a citizen (Anonymous owner)
        // unless explicitly handled otherwise.
        if ($creator && ($creator->role === 'admin' || $creator->role === 'atendimento')) {
            $ownerId = null;
        }

        // Also maintain privacy for public form testing if needed, but the role check above covers Admin testing.
        // If a citizen uses Triagem, they keep ownership.

        if ($creator && $validated['categoria'] !== 'Triagem') {
            $initialStatus = "Encaminhada para " . $validated['categoria'];
        }

        $demanda = Demanda::create([
            'user_id' => $ownerId, // Nullable. Staff creation = null (Anonymous/Manual data). Citizen creation = ID.
            'categoria' => $validated['categoria'],
            'assunto' => $validated['assunto'],
            'descricao' => $validated['descricao'],
            'arquivo' => $path,
            'protocolo' => 'C360-' . date('Ymd') . '-' . strtoupper(str()->random(4)),
            'status' => $initialStatus,
            'cpf_solicitante' => $validated['cpf'] ?? null,
        ]);

        \App\Models\DemandaHistorico::create([
            'demanda_id' => $demanda->id,
            'user_id' => $creator?->id, // Log WHO created it (Admin/Dispatcher/Citizen)
            'status' => 'Demanda Registrada',
            'descricao' => 'Demanda registrada com sucesso no sistema.',
        ]);

        // If status is forwarded, log it
        if ($initialStatus !== 'Aberto') {
            \App\Models\DemandaHistorico::create([
                'demanda_id' => $demanda->id,
                'user_id' => $creator?->id, // Log WHO forwarded it
                'status' => 'Encaminhamento automático',
                'descricao' => "Demanda registrada e encaminhada automaticamente para o setor {$validated['categoria']}",
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $demanda,
            'message' => 'Demanda criada com sucesso'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $demanda = Demanda::find($id);

        if (!$demanda) {
            return response()->json(['success' => false, 'message' => 'Demanda não encontrada'], 404);
        }

        $validated = $request->validate([
            'status' => 'nullable|string',
            'descricao' => 'nullable|string',
            'observacao' => 'nullable|string',
        ]);

        $oldStatus = $demanda->status;
        $observacao = $request->input('observacao', '');
        $statusAlterado = isset($validated['status']) && $validated['status'] !== $oldStatus;

        // 1. Lógica de Encaminhamento
        if (isset($validated['status']) && str_starts_with($validated['status'], 'Encaminhada para ')) {
            $targetSector = str_replace('Encaminhada para ', '', $validated['status']);
            $demanda->categoria = $targetSector;

            $descricaoHistorico = "Demanda encaminhada para o setor {$targetSector}.";
            if (!empty($observacao)) {
                $descricaoHistorico .= " Justificativa: {$observacao}";
            }

            \App\Models\DemandaHistorico::create([
                'demanda_id' => $demanda->id,
                'user_id' => $request->user()?->id,
                'status' => 'Encaminhamento',
                'descricao' => $descricaoHistorico,
            ]);
        }
        // 2. Lógica de Mudança de Status Padrão OU Apenas Observação
        elseif ($statusAlterado || !empty($observacao)) {
            $novoStatus = $validated['status'] ?? $oldStatus;

            if ($statusAlterado) {
                // Gerar mensagem amigável baseada na mudança de status
                if (str_starts_with($oldStatus, 'Encaminhada para ') && $novoStatus === 'Em andamento') {
                    $setor = str_replace('Encaminhada para ', '', $oldStatus);
                    $descricaoHistorico = "O setor {$setor} iniciou o atendimento da sua demanda.";
                } elseif ($novoStatus === 'Concluído') {
                    $descricaoHistorico = "O atendimento da sua demanda foi concluído com sucesso.";
                } elseif ($novoStatus === 'Em andamento') {
                    $descricaoHistorico = "O atendimento da sua demanda foi iniciado.";
                } else {
                    $descricaoHistorico = "O status da demanda foi atualizado para '{$novoStatus}'.";
                }
            } else {
                // Apenas uma observação sem mudar o status
                $descricaoHistorico = "Atualização / Nota Interna";
            }

            if (!empty($observacao)) {
                if ($statusAlterado) {
                    $descricaoHistorico .= " Observação: {$observacao}";
                } else {
                    $descricaoHistorico = $observacao; // Se for só nota, a nota é a descrição principal
                }
            }

            \App\Models\DemandaHistorico::create([
                'demanda_id' => $demanda->id,
                'user_id' => $request->user()?->id,
                'status' => $statusAlterado ? $novoStatus : "Atualização",
                'descricao' => $descricaoHistorico,
            ]);
        }

        $demanda->update($validated);

        return response()->json([
            'success' => true,
            'data' => $demanda,
            'message' => 'Demanda atualizada com sucesso'
        ]);
    }

    public function destroy($id)
    {
        $demanda = Demanda::find($id);

        if (!$demanda) {
            return response()->json(['success' => false, 'message' => 'Demanda não encontrada'], 404);
        }

        $demanda->delete();

        return response()->json([
            'success' => true,
            'message' => 'Demanda excluída com sucesso'
        ]);
    }
    public function search(Request $request, $protocolo)
    {
        $demanda = Demanda::with('historico')->where('protocolo', $protocolo)->first();

        if (!$demanda) {
            return response()->json(['success' => false, 'message' => 'Protocolo não encontrado'], 404);
        }

        // Backend CPF Verification
        $cpfProvided = $request->query('cpf', '');

        // Remove non-digits for comparison
        $cpfClean = preg_replace('/\D/', '', $cpfProvided);

        if (empty($cpfClean)) {
            return response()->json(['success' => false, 'message' => 'CPF é obrigatório para consulta'], 400);
        }

        // Check against column if exists
        if ($demanda->cpf_solicitante) {
            $bankCpfClean = preg_replace('/\D/', '', $demanda->cpf_solicitante);
            if ($bankCpfClean !== $cpfClean) {
                return response()->json(['success' => false, 'message' => 'Dados inválidos'], 403);
            }
        } else {
            // Legacy fallback: check description
            $descriptionClean = preg_replace('/\D/', '', $demanda->descricao);
            if (!str_contains($descriptionClean, $cpfClean)) {
                return response()->json(['success' => false, 'message' => 'Dados inválidos'], 403);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $demanda,
            'message' => 'Demanda encontrada'
        ]);
    }

    public function rate(Request $request, $id)
    {
        $demanda = Demanda::find($id);

        if (!$demanda) {
            return response()->json(['success' => false, 'message' => 'Demanda não encontrada'], 404);
        }

        $validated = $request->validate([
            'nota' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:500',
        ]);

        $demanda->update([
            'satisfacao_nota' => $validated['nota'],
            'satisfacao_comentario' => $validated['comentario'] ?? null,
            'satisfacao_data' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Avaliação recebida com sucesso'
        ]);
    }

    public function stats()
    {
        $now = Carbon::now();
        $last12Months = collect(range(11, 0))->map(function ($i) use ($now) {
            $date = $now->copy()->subMonths($i);
            return [
                'month' => $date->format('M/Y'),
                'abertas' => Demanda::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->count(),
                'concluidas' => \App\Models\DemandaHistorico::where('status', 'Concluído')
                    ->whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->distinct('demanda_id')
                    ->count('demanda_id'),
            ];
        });

        $stats = [
            'abertas' => Demanda::where('status', 'Aberto')->count(),
            'andamento' => Demanda::where('status', 'Em andamento')->count(),
            'concluidas' => Demanda::where('status', 'Concluído')->count(),
            'concluidas_mes' => \App\Models\DemandaHistorico::where('status', 'Concluído')
                ->whereMonth('created_at', $now->month)
                ->whereYear('created_at', $now->year)
                ->distinct('demanda_id')
                ->count('demanda_id'),
            'recentes' => Demanda::orderByRaw("
                CASE 
                    WHEN status = 'Aberto' THEN 1
                    WHEN status LIKE 'Encaminhada para%' THEN 2
                    WHEN status = 'Em andamento' THEN 3
                    WHEN status = 'Concluído' THEN 4
                    ELSE 5
                END
            ")
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(),
            'categorias' => Demanda::select('categoria', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
                ->groupBy('categoria')
                ->get(),
            'status_detalhado' => Demanda::select('status', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
                ->groupBy('status')
                ->get(),
            'ranking_setores' => Demanda::select('categoria', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
                ->groupBy('categoria')
                ->orderBy('total', 'desc')
                ->take(5)
                ->get(),
            'tendencias' => $last12Months
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
