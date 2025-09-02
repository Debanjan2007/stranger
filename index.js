import 'dotenv/config'
import express from "express";
import http from 'http'
import { router } from './routes/index.routes.js'
import { Server } from 'socket.io'
import { connectDB } from "./db/db.connect.js";
import cookieParser from 'cookie-parser';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unAuthorisedHandler } from './middleware/unauthorisedHandler.js'

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// parsing the middlewares 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use('/api/client', router);



app.get('/', (req, res) => {   
    res.render('index.ejs', { error: req.query.error });
})
app.get('/homepage',
    unAuthorisedHandler,
    (req, res) => {
    res.render('homepage.ejs' );
})
connectDB()
    .then(() => {
        // here the http was needed because in case of websockets the first req is a http handshake req 
        // then it accepts the handshack amd a stable connection is established
        // So the http server must be created to send the http handshake req 
        const server = http.createServer(app);

        // mount on the server i.e on the same port existance same as websocket
        const io = new Server(server);

        io.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('chat message', (msg) => {
                io.emit('incoming message', msg); // broadcast the message to all connected clients
            })
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });

        server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        })
    })
.catch((err) => {
    if(err){
        console.log(`Database connection failed: ${err.message}`);
        process.exit(1);
    }
})