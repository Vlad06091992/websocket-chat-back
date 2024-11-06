import express, {json} from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'

const app = express();
app.use(json());
app.use(cors());

const messages = [
    { message: "Hello Vlad", id: "23f2332", user: { id: "sddsdsfds", name: "Dima" }},
    { message: "Hello Dima", id: "23fd32c23", user: { id: "eefw2", name: "Vlad" }}
]



const server = http.createServer(app);
const socketApp = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})




app.get('/',cors(),(req, res) => {
    res.send("Hello, it's a WebSocket server!");
});


socketApp.on('connection' ,(connection) => {
    connection.on("client-message-sent" ,(message) => {
        console.log(message);
        const messageItem = {message,id:new Date().getMilliseconds().toString(),user: { id: "eefw2", name: "Vlad" }}

        messages.push(messageItem)
        console.log(messages)

        connection.emit('new-message-sent', messageItem)

    });

    connection.emit("init-messages-published" ,messages);
});



server.listen(3009, () => {
    console.log('Listening on *:3000');
});
