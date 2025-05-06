# Info o projekte:
- Meno a priezvisko: Mykhailo Malinov
- Názov projektu: Web Chat
- Link na repozitár: https://github.com/MishaMalinov/web_chat
- Link na verejnú inštanciu projektu: https://web-chat-frontend-3wc1.onrender.com/

# Info o reportovanej verzii:
- Tag: final_1

# Info k testovaniu:     
To test, you need to register or use an existing account (username: `test_username`, password: `test_password`).  
Testing: global user search, creating a chat with a user, sending messages, editing a profile, attaching and sending files.

# Postup, ako rozbehať vývojové prostredie 
The project consists of three parts: **frontend**, **backend**, and **websocket server**.

### frontend:
```bash
cd ./frontend
npm i
npm run dev
```

### backend:
You must have PHP version 8.2 or higher and Composer installed.  
You need to create an `.env` file into which you need to copy everything from `.env.example`.  
Next, follow the commands below:

```bash
cd ./backend
composer install 
php artisan migrate
php artisan storage:link
php artisan serve
```

### websocket:
```bash
cd ./ws_server
npm i
npm run start
```

Then the site will be available at [http://localhost:5173/](http://localhost:5173/).

# Stav implementácie:
All implemented and working
1. Private Chats between different users. 
2. Personal Chat (sending messages to oneself for note-taking). 
3. File Sharing (images, videos, documents). 
4. File Previewing within the chat interface. 
5. User Profile Management (edit username, avatar, bio, etc.).

# Retrospektíva:
1. Keby ste to robili znovu, čo by ste urobili inak?
 - I would use a different backend, because Laravel doesn't support websockets and I had to write a websocket server on the node.js
2. Ste hrdý na výsledky svojej práce? Ktorý aspekt projektu je podľa Vás najviac kvalitný?
 - I do like my project.
 - It seems to me that the backend is written quite well.



