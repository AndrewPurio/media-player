import cors from 'cors';
import express, { Express, Request, response, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import type { PlayMedia } from "./types"
import playerctl from './utils/playerctl';
import { playMedia } from './utils/vlc';

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

    socket.on("playMusic", ({ path, loop }: PlayMedia) => {
        try {
            playMedia(path, {
                loop: !!loop
            })
        } catch (error) {
            socket.emit("error", error)
        }
    })

    socket.on("play", () => {
        playerctl("play")
    })

    socket.on("pause", (data) => {
        playerctl("pause")
    })

    socket.on("stop", (data) => {
        playerctl("stop")
    })

    socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id)
    })
})

server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
})