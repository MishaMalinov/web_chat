<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function createMessage(Request $request)
    {
        $request->validate([
            'chat_id' => 'required|integer|exists:chats,id',
            'attachment_id' => 'nullable|integer|exists:attachments,id',
            'message' => 'nullable|string',
            'read_at' => 'nullable|date',
        ]);

        $message = Message::create([
            'chat_id' => $request->chat_id,
            'sender_id' => $request->user()->id,
            'attachment_id' => $request->attachment_id,
            'content' => $request->message,
            'read_at' => $request->read_at,
        ]);

        return response()->json([
            'sender' => [
                'username' => $message->sender->username,
            ],
            'text' => $message->content,
            'date' => $message->created_at->toDateTimeString(),
        ], 201);
    }

}
