import cors from 'cors';
import express, { Express, Request, response, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import store from 'store2';

import type { PlayMedia } from "./types"
import { execute } from './utils/execute';
import playerctl from './utils/playerctl';
import MediaPlayer, { stopMedia } from './utils/vlc';

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
    const mediaPlayer = new MediaPlayer()
    const userStore = {
        mediaPlayerId: mediaPlayer.getPlayer().pid,
        spawnArgs: mediaPlayer.getPlayer().spawnargs
    }

    store.set(socket.id, userStore)

    socket.on("playMusic", async ({ path, loop }: PlayMedia) => {
        try {
            // Kill previous player instance to prevent music playing simultaneously
            const data: typeof userStore = await store.get(socket.id)

            await stopMedia(data.mediaPlayerId as number)
            await execute("killall vlc")

            setTimeout(() => {
                mediaPlayer.playMedia(path, {
                    loop: !!loop
                })

                const mediaStore = {
                    mediaPlayerId: mediaPlayer.getPlayer().pid,
                    spawnArgs: mediaPlayer.getPlayer().spawnargs
                }

                store.set(socket.id, mediaStore)
            }, 200)
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