<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $users = UserResource::collection(User::all());

        return $this->collectionResponse($users, 'Data pengguna berhasil diambil');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:student,instructor,admin',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);

        return $this->created(new UserResource($user), 'Pengguna berhasil dibuat');
    }

    public function show(User $user): JsonResponse
    {
        return $this->resourceResponse(new UserResource($user), 'Data pengguna berhasil diambil');
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:50',
            'email' => 'sometimes|email|unique:users,email,'.$user->id,
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|in:student,instructor,admin',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $user->update($validated);

        return $this->resourceResponse(new UserResource($user), 'Pengguna berhasil diperbarui');
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return $this->success(null, 'Pengguna berhasil dihapus');
    }
}
