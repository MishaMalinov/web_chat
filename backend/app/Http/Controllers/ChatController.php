<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
class ChatController extends Controller
{

    public function createChat(Request $request): JsonResponse
    {
        $user1 = $request->user();
        $user2 = User::query()->where('username', $request->input('username'))->firstOrFail();

        $userIds = [$user1->id, $user2->id];
        sort($userIds);

        $existingChat = Chat::query()->where('user1_id', $userIds[0])
            ->where('user2_id', $userIds[1])
            ->first();

        if ($existingChat) {
            return response()->json(['chat' => $existingChat], 200);
        }

        $chat = Chat::create([
            'user1_id' => $userIds[0],
            'user2_id' => $userIds[1],
        ]);

        return response()->json(['chat' => $chat], 201);
    }

    public function getChats(Request $request): JsonResponse
    {
        $user = $request->user();

        $chats = Chat::query()
            ->where('user1_id', $user->id)
            ->orWhere('user2_id', $user->id)
            ->with(['user1', 'user2'])
            ->get();

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
