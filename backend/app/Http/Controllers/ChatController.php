<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\User;
use App\Services\ChatService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
class ChatController extends Controller
{

    public function createChat(Request $request): JsonResponse
    {
        $user1 = $request->user();
        $user2 = User::query()->where('username', $request->input('username'))->firstOrFail();

        return ChatService::createChat($user1->id, $user2->id);
    }

    public function getChats(Request $request): JsonResponse
    {
        $user = $request->user();

        $chats = Chat::with(['user1', 'user2'])
            ->where('user1_id', $user->id)
            ->orWhere('user2_id', $user->id)
            ->get();

        $selfChat = $chats->firstWhere(fn($chat) => $chat->user1_id === $user->id && $chat->user2_id === $user->id);
        if($selfChat) {
            $chats = $chats->reject(fn($chat) => $selfChat && $chat->id === $selfChat->id)->prepend($selfChat);
        }

        $chats = $chats->map(function ($chat) use ($user) {
            $row = [];
            $currentUser = $chat->user1;
            if($chat->user1->id == $user->id){
                $currentUser = $chat->user2;
            }
            $row['username'] = $currentUser->username;
            $row['avatar'] = $currentUser->avatar??null ;
            $row['name'] = $currentUser->name ?? $currentUser->username;
            return $row;
        });



        return response()->json(['chats' => $chats], 200);
    }


}
