<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Models\Attachment;
class MessageController extends Controller
{
    public function createMessage(Request $request)
    {
        $request->validate([
            'chat_id' => 'required|integer|exists:chats,id',
            'temp_id' => 'required',
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

        try{
            Http::post(env("WSS_URL") ? env("WSS_URL")."/broadcast" : "http://localhost:10000/broadcast", [
                'chat_id' => $message->chat_id,
                'sender' => [
                    'username' => $message->sender->username,
                ],
                'text' => $message->content,
                'date' => $message->created_at->toDateTimeString(),
                'temp_id' => $request->input('temp_id'),
            ]);
        }catch (\Exception $e){}


        return response()->json([
            'sender' => [
                'username' => $message->sender->username,
            ],
            'text' => $message->content,
            'date' => $message->created_at->toDateTimeString(),
        ], 201);
    }

    public function attachFiles(Request $request)
    {
        $request->validate([
            'chat_id' => 'required|exists:chats,id',
            'files.*' => 'required|file|max:102400', // 100MB per file
        ]);

        $user = $request->user();
        $messages = [];

        foreach ($request->file('files') as $file) {
            $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs("attachments/chat_{$request->chat_id}", $fileName, 'gcs');
            $type = $file->getClientMimeType();
            $fullPath = Storage::disk('gcs')->url($path);
            // Create attachment
            $attachment = Attachment::create([
                'file_path' => $fullPath,
                'file_type' => $type,
            ]);

            // Create message linked to attachment
            $message = Message::create([
                'chat_id' => $request->chat_id,
                'sender_id' => $user->id,
                'attachment_id' => $attachment->id,
                'content' => null,
                'read_at' => null,
            ]);

            // Send to websocket server
            try {
                Http::post(env("WSS_URL") ? env("WSS_URL")."/broadcast" : "http://localhost:10000/broadcast", [
                    'chat_id' => $message->chat_id,
                    'sender' => [
                        'username' => $message->sender->username,
                    ],
                    'text' => null,
                    'attachment' => [
                        'url' => $fullPath,
                        'type' => $attachment->file_type,
                    ],
                    'date' => $message->created_at->toDateTimeString(),
                    'temp_id' => $request->input('temp_id'), 
                ]);
            } catch (\Exception $e) {
                // Log or silently ignore
            }

            $messages[] = [
                'sender' => [
                    'username' => $message->sender->username,
                ],
                'attachment' => [
                    'url' => $fullPath,
                    'type' => $attachment->file_type,
                ],
                'date' => $message->created_at->toDateTimeString(),
            ];
        }

        return response()->json([
            'messages' => $messages,
        ], 201);
    }


}
