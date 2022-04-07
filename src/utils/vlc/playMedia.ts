import { execute } from "../execute";

interface PlayMediaConfig {
    loop?: boolean
}

/**
 * Play a media file/url
 * @param file The absolute path or url of the media to play
 */
export async function playMedia(file: string, config?: PlayMediaConfig) {
    const command = [ "cvlc", file ]

    if(config?.loop)
        command.push("--loop")

    try {
        const commandStr = command.join(" ")
        console.log("Command:", commandStr)
        const result = await execute(commandStr)

        console.log("Result:", result)
        return result
    } catch (error) {
        throw (error)
    }
}