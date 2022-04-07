import express from "express"
import { playMedia } from "./utils/vlc/index"

const app = express()
const port = 4000

app.get("/", (request, response) => {
    response.json({
        Hello: "World"
    })
})

app.get("/play", async (request, response) => {
    const { query } = request

    if (!query.media) {
        response.status(400)

        response.json({
            "message": `Missing "media" query which is either a file path or a url`
        })

        return
    }

    console.log(query)

    try {
        const media = query.media as string
        const { stdout, stderr } = await playMedia(media)

        console.log("Stdout:", stdout)
        console.log("Stderr:", stderr)
    } catch (e) {
        const { message } = e as Error
        response.status(400)

        response.json({
            message
        })
    }

    response.json("Playing Media")
})

app.listen(port, () => {
    console.log(`App listening at "http://localhost:${port}"`)
})
