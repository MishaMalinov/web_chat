<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Chat;
use App\Models\User;
use App\Services\ChatService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Http\JsonResponse;
use Laravel\Sanctum\Sanctum;

class UserController extends Controller
{
    public function getUser(Request $request): JsonResponse
    {
        return response()->json(UserResource::make($request->user()), 200);
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        ChatService::createChat($user->id, $user->id);

        return response()->json(['message' => 'User registered successfully', 'token' => $token], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
//            'email' => 'required|email',
            'username' => ['required', 'string', 'max:255', 'exists:users'],
            'password' => 'required'
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ]);
    }
    public function search(Request $request): JsonResponse
    {
        $searchTerm = $request->query('query');
        $currentUserId = $request->user()->id;

        // Get IDs of users already in a chat with the current user
        $chatUserIds = Chat::query()
            ->where('user1_id', $currentUserId)
            ->orWhere('user2_id', $currentUserId)
            ->get()
            ->flatMap(function ($chat) use ($currentUserId) {
                return [$chat->user1_id, $chat->user2_id];
            })
            ->unique()
            ->reject(fn ($id) => $id === $currentUserId);

        // Search users, exclude self and existing chat users
        $users = User::query()
            ->where('username', 'LIKE', "%{$searchTerm}%")
            ->where('id', '!=', $currentUserId)
            ->whereNotIn('id', $chatUserIds)
            ->limit(10)
            ->get();

        return response()->json(UserResource::collection($users));
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();


        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255|unique:users,username,' . $user->id,
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'bio' => 'nullable|string|max:255',
        ]);

        $user->fill($validated);

        if ($request->hasFile('avatar')) {
            $user->clearMediaCollection('avatar');
            $user->addMedia($request->file('avatar'))->toMediaCollection('avatar');
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

}
