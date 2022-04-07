import express from "express"
import { playMedia } from "./utils/vlc/index"

const app = express()

app.get("/", (request, response) => {
    response.json({
        Hello: "World"
    })
})

app.get("/test", (request, response) => {
    response.json("Test Response")
})

app.listen(3000)
