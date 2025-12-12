<?php

namespace App\Http\Controllers;

use App\Models\Comunicado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ComunicadoController extends Controller
{
    public function index()
    {
        $comunicados = Comunicado::latest('data_publicacao')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $comunicados,
            'message' => 'Comunicados listados com sucesso'
        ]);
    }

    public function show($id)
    {
        $comunicado = Comunicado::find($id);

        if (!$comunicado) {
            return response()->json(['success' => false, 'message' => 'Comunicado não encontrado'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $comunicado,
            'message' => 'Detalhes do comunicado'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string',
            'resumo' => 'required|string',
            'conteudo' => 'required|string',
            'data_publicacao' => 'required|date',
            'arquivo' => 'nullable|file|max:10240',
        ]);

        $path = null;
        if ($request->hasFile('arquivo')) {
            $path = $request->file('arquivo')->store('comunicados', 'public');
        }

        $comunicado = Comunicado::create([
            'titulo' => $validated['titulo'],
            'resumo' => $validated['resumo'],
            'conteudo' => $validated['conteudo'],
            'data_publicacao' => $validated['data_publicacao'],
            'arquivo' => $path,
        ]);

        return response()->json([
            'success' => true,
            'data' => $comunicado,
            'message' => 'Comunicado criado com sucesso'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $comunicado = Comunicado::find($id);

        if (!$comunicado) {
            return response()->json(['success' => false, 'message' => 'Comunicado não encontrado'], 404);
        }

        $validated = $request->validate([
            'titulo' => 'nullable|string',
            'resumo' => 'nullable|string',
            'conteudo' => 'nullable|string',
            'data_publicacao' => 'nullable|date',
        ]);

        $comunicado->update($validated);

        return response()->json([
            'success' => true,
            'data' => $comunicado,
            'message' => 'Comunicado atualizado com sucesso'
        ]);
    }

    public function destroy($id)
    {
        $comunicado = Comunicado::find($id);

        if (!$comunicado) {
            return response()->json(['success' => false, 'message' => 'Comunicado não encontrado'], 404);
        }

        $comunicado->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comunicado excluído com sucesso'
        ]);
    }
}
