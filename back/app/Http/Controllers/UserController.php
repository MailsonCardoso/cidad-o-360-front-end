<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $users,
            'message' => 'Usuários listados com sucesso'
        ]);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuário não encontrado'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Detalhes do usuário'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,user,atendimento',
            'setor' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_security_agent' => $request->boolean('is_security_agent'), // Backward compatibility
            'setor' => $request->input('setor'),
        ]);

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Usuário criado com sucesso'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuário não encontrado'], 404);
        }

        $validated = $request->validate([
            'name' => 'nullable|string',
            'role' => 'nullable|in:admin,user,atendimento',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'is_security_agent' => 'nullable|boolean',
            'setor' => 'nullable|string',
        ]);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Usuário atualizado com sucesso'
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuário não encontrado'], 404);
        }

        // Unlink related records to avoid foreign key constraints
        // Set user_id to null instead of deleting to preserve history
        $user->demandas()->update(['user_id' => null]);
        $user->demandaHistorico()->update(['user_id' => null]);

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuário excluído com sucesso'
        ]);
    }
}
