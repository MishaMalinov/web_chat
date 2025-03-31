<?php

namespace App\Services;

use App\Models\Chat;
use App\Models\User;

class ChatService
{
    public static function createChat($user1_id, $user2_id)
    {

        $userIds = [$user1_id, $user2_id];
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
}
