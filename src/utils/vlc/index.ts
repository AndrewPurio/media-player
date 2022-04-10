import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { execute } from "../execute";

export interface PlayMediaConfig {
    loop?: boolean
}

/**
 * Play a media file/url
 * @param file The absolute path or url of the media to play
 */
export function playMedia(file: string, config?: PlayMediaConfig) {
    const options = [file]

    if (config?.loop)
        options.push("--loop")

    const cvlc = spawn("cvlc", options)

    return cvlc
}

export async function stopMedia(pid: number) {
    await execute(`kill ${pid}`)
}

export default class MediaPlayer {
    private player: ChildProcessWithoutNullStreams

    constructor() {
        this.player = spawn("cvlc")
    }

    public getPlayer() {
        return this.player
    }

    public playMedia(file: string, config?: PlayMediaConfig) {
        const options = [file]

        if (config?.loop)
            options.push("--loop")

        const cvlc = spawn("cvlc", options)

        this.player = cvlc
    }
}