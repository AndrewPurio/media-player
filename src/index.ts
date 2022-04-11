import cors from 'cors';
import express from 'express';
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

app.get("/test", (request, response) => {
    response.sendFile("index.html", {
        root: "./static"
    })
})

app.post("/playMedia", (request, response) => {
    const { body } = request
    const data = body as PlayMedia

    if (!data.path) {
        response.statusCode = 400
        response.json({
            message: "Missing path parameter for the target media to play"
        })

        return
    }

    const { path, loop } = data
    playMedia(path, {
        loop: !!loop
    })

    response.json({
        message: "Successfully playing media"
    })
})

app.get("/stop", (request, response) => {
    playerctl("stop")

    response.json({
        message: "Media playing stopped"
    })
})

io.on("connection", (socket) => {
    console.log('Connected:', socket.id);

    socket.on("playMedia", ({ path, loop }: PlayMedia) => {
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
    })
})

server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
})