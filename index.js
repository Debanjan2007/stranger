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
import fs from 'fs';

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
        res.render('homepage.ejs');
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
            let teamArr = []
            socket.on('fetch-userData', (userName) => {
                console.log("username is : ", userName);
                const dirpath = path.join(__dirname, '/Teams');
                const filepath = path.join(dirpath, `${userName}.json`)
                if (!fs.existsSync(filepath)) {
                    console.log("No team file found for", userName);
                    socket.emit('user-dataFetched', JSON.stringify([]));
                    return;
                }
                const dataFetched = fs.readFileSync(filepath, 'utf-8', (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                })
                if (dataFetched) {
                    socket.emit('user-dataFetched', dataFetched)
                }
                socket.on('Fetch-complete', async () => {
                    await fs.unlink(`${dirpath}/${userName}.json`, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    })
                })
            })
            socket.on('send-msg' , (msg , roomName) => {
                io.except(roomName).emit('gotMsg' , msg)
            })
            socket.on('joinRoom' , (roomName , socketID) => {
                console.log("Joining the team named",roomName);                
                socket.join(roomName)
                io.except(roomName).emit('newUser' , socketID)
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
        if (err) {
            console.log(`Database connection failed: ${err.message}`);
            process.exit(1);
        }
    })