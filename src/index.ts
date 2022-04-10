import cors from 'cors';
import express, { Express, Request, response, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ChildProcessWithoutNullStreams } from 'child_process';

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
    let player: ChildProcessWithoutNullStreams
    console.log('Connected:', socket.id);

    socket.on("playMusic", ({ path, loop }: PlayMedia) => {
        try {
            // Kill previous player instance to prevent music playing simultaneously
            if(player)
                player.kill()

            player = playMedia(path, {
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