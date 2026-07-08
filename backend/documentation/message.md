# Message
in the messages page, please implement this code:
```js
const ws = new WebSocket('ws://localhost:3001?token={TOKEN}');

ws.on('message', userId => {
    
})
```

please make sure that this happens:
- if the userId matches the current userId that the user is having a conversation with, call GET /api/message with the body parameter to be userId as the given userId
- otherwise, call GET /api/message/list

PUT /api/message/:id - edits a message
BODY PARAMETERS:
- message: the message to be updated with

DELETE /api/message/:id - deletes a message

GET /api/message - gets all messages involved with a user
BODY PARAMETERS:
- userId: the user whom the user had a conversation with

POST /api/message - creates a new message
BODY PARAMETERS:
- receiverUserId: the user who will receive the message
- message: the message to be sent

GET /api/message/list - lists all users involved in messages with a user, along with the most recent message