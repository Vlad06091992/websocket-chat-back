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

const generateId = () => new Date().getMilliseconds().toString()

const usersState = new Map()


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


socketApp.on('connection' ,(socketChannel) => {

    usersState.set(socketChannel, {id:generateId(),name:'Anon'})
debugger
    socketChannel.on("client-name-sent" ,(name) => {
        const user = usersState.get(socketChannel)
        user.name = name
debugger
        socketApp.on('disconnect',()=>{
            usersState.delete(socketChannel)
        })

    });

    socketChannel.on("client-message-sent" ,(message) => {
        debugger
        console.log(message);

        const user = usersState.get(socketChannel)
debugger
        const messageItem = {message,id:generateId(),user}

        messages.push(messageItem)
        console.log(messages)

        socketChannel.emit('new-message-sent', messageItem)

    });

    socketChannel.emit("init-messages-published" ,messages);
});



server.listen(3009, () => {
    console.log('Listening on *:3000');
});
