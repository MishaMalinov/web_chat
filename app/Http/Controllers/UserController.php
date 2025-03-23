<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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
        $users = User::where('username', 'ILIKE', "%{$searchTerm}%")
            ->orWhere('email', 'ILIKE', "%{$searchTerm}%")
            ->limit(10) // Limit results for efficiency
            ->get();

        return response()->json($users);
    }
}
