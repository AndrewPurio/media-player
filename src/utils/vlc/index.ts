import { execute } from "../execute";
import playerctl from "../playerctl"

export interface PlayMediaConfig {
    loop?: boolean
}

/**
 * Play a media file/url
 * @param file The absolute path or url of the media to play
 */
export async function playMedia(file: string, config?: PlayMediaConfig) {
    try {
        // await playerctl("stop")
        const command = ["cvlc", file]

        if (config?.loop)
            command.push("--loop")

        const commandStr = command.join(" ")
        const result = await execute(commandStr)

        return result
    } catch (error) {
        throw (error)
    }
}