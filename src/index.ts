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

app.use(express.json())
app.use(cors())

app.get("/", (request, response) => {
    response.json("Hello World")
})

app.get("/test", (request, response) => {
    response.sendFile("index.html", {
        root: "./static"
    })
})

app.post("/playMedia", async (request, response) => {
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

    const { stdout } = await playerctl("status")

    io.sockets.emit("status", {
        "status": stdout
    })

    response.json({
        message: "Successfully playing media"
    })
})

app.get("/stop", async (request, response) => {
    await playerctl("stop")

    const { stdout } = await playerctl("status")

    io.sockets.emit("status", {
        "status": stdout
    })

    response.json({
        message: "Media playing stopped"
    })
})

io.on("connection", (socket) => {
    socket.on("playMedia", ({ path, loop, volume }: PlayMedia) => {
        playMedia(path, {
            loop: !!loop
        })

        const value = volume / 100

        playerctl("volume", {
            value
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