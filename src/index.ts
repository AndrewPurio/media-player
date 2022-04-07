import cors from 'cors';
import express, { Express, Request, response, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const port = 3000
// const dev = process.env.NODE_ENV !== 'production';

const app = express()
const server = createServer(app)
const io = new Server({
    cors: {
        origin: "*"
    }
})

io.attach(server)

app.use(cors())

app.get("/", (request, response) => {
    response.json("Hello World")
})

io.on("connection", (socket) => {
    console.log('Connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id)
    })
})

io.on("play", (data) => {
    console.log("Data:", data)
})

io.on("pause", (data) => {
    console.log("Data:", data)
})

io.on("stop", (data) => {
    console.log("Data:", data)
})

server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
})