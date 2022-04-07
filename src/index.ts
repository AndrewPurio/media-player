import express from "express"
import { playMedia } from "./utils/vlc/index"

const app = express()

app.get("/", (request, response) => {
    response.json({
        Hello: "World"
    })
})

app.get("/play", async (request, response) => {
    const { query } = request

    if (!query.audio) {
        response.status(400)

        response.json({
            "message": `Missing "audio" query which is either a file path or a url`
        })

        return
    }

    try {
        const { stdout, stderr } = await playMedia(query.audio as string)
        
        console.log("Stdout:", stdout)
        console.log("Stderr:", stderr)
    } catch (error) {
        
    }

    response.json("Playing Audio")
})

app.listen(3000)
