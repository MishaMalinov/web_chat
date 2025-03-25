<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
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
        return response()->json(new UserResource($request->user()), 200);
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

//        event(new Registered($user));

        $token = $user->createToken('auth_token')->plainTextToken;
//        $token = $request->username;
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

        // Search users by username or email
        $users = User::where('username', 'LIKE', "%{$searchTerm}%")
//            ->orWhere('email', 'LIKE', "%{$searchTerm}%")
            ->limit(10) // Limit results for efficiency
            ->get();

        return response()->json($users);
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
            $user->addMedia($request->file('avatar'))->toMediaCollection('avatar', 'avatars');
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

}
