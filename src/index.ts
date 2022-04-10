import cors from 'cors';
import express, { Express, Request, response, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import type { PlayMedia } from "./types"
import { execute } from './utils/execute';
import playerctl from './utils/playerctl';
import MediaPlayer, { playMedia, stopMedia } from './utils/vlc';

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
        playMedia(path, {
            loop: !!loop
        })
    })

    socket.on("play", () => {
        playerctl("play")
    })

    socket.on("pause", (data) => {
        playerctl("pause")
    })

    socket.on("play-pause", () => {
        playerctl("play-pause")
    })

    socket.on("stop", () => {
        playerctl("stop")
    })

    socket.on("volume", (data?: {
        value: number
    }) => {
        if (data) {
            data.value /= 100
            playerctl("volume", data)
            return
        }

        playerctl("volume")
    })

    socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id)

        // clearInterval(playyerTracker)
    })
})

server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
})