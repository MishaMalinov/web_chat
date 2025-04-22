# Info o projekte:
- Meno a priezvisko: Mykhailo Malinov
- Názov projektu: Web Chat
- Link na repozitár: https://github.com/MishaMalinov/web_chat
- Link na verejnú inštanciu projektu: https://web-chat-frontend-3wc1.onrender.com/

# Info o reportovanej verzii:
- Tag: beta

# Info k testovaniu:     
To test, you need to register or use an existing account (username: `test_username`, password: `test_password`).  
Testing: global user search, creating a chat with a user, sending messages, editing a profile.

# Postup, ako rozbehať vývojové prostredie:
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
- **Implemented**: authentication, editing profile, global user search, create chats, sending and receiving messages.
- **Not implemented**: sending files.

# Časový plán:
- **week10**: sending files.
- **week11**: final testing, small fixes.

# Problémy:
- No problems occurred