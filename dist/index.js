"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const playerctl_1 = __importDefault(require("./utils/playerctl"));
const vlc_1 = require("./utils/vlc");
const port = 3000;
// const dev = process.env.NODE_ENV !== 'production';
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server({
    cors: {
        origin: "*"
    }
});
io.attach(server);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (request, response) => {
    response.json("Hello World");
});
app.get("/test", (request, response) => {
    response.sendFile("index.html", {
        root: "./static"
    });
});
app.post("/playMedia", async (request, response) => {
    const { body } = request;
    const data = body;
    if (!data.path) {
        response.statusCode = 400;
        response.json({
            message: "Missing path parameter for the target media to play"
        });
        return;
    }
    if (!data.volume) {
        response.statusCode = 400;
        response.json({
            message: "Missing volume parameter for the target media to play"
        });
        return;
    }
    const { path, loop, volume } = data;
    const value = volume / 100;
    (0, vlc_1.playMedia)(path, {
        loop: !!loop
    });
    (0, playerctl_1.default)("volume", {
        value
    });
    const { stdout } = await (0, playerctl_1.default)("status");
    io.sockets.emit("status", {
        "status": stdout
    });
    response.json({
        message: "Successfully playing media"
    });
});
app.get("/stop", async (request, response) => {
    await (0, playerctl_1.default)("stop");
    const { stdout } = await (0, playerctl_1.default)("status");
    io.sockets.emit("status", {
        "status": stdout
    });
    response.json({
        message: "Media playing stopped"
    });
});
io.on("connection", (socket) => {
    socket.on("playMedia", ({ path, loop, volume }) => {
        (0, vlc_1.playMedia)(path, {
            loop: !!loop
        });
        const value = volume / 100;
        (0, playerctl_1.default)("volume", {
            value
        });
    });
    socket.on("play", () => {
        (0, playerctl_1.default)("play");
    });
    socket.on("pause", (data) => {
        (0, playerctl_1.default)("pause");
    });
    socket.on("play-pause", () => {
        (0, playerctl_1.default)("play-pause");
    });
    socket.on("stop", () => {
        (0, playerctl_1.default)("stop");
    });
    socket.on("volume", (data) => {
        if (data) {
            data.value /= 100;
            (0, playerctl_1.default)("volume", data);
            return;
        }
        (0, playerctl_1.default)("volume");
    });
    socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id);
    });
});
server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
});
