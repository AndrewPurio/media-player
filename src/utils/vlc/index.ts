import { spawn } from "child_process";
import { execute } from "../execute";

export interface PlayMediaConfig {
    loop?: boolean
}

/**
 * Play a media file/url
 * @param file The absolute path or url of the media to play
 */
export function playMedia(file: string, config?: PlayMediaConfig) {
    const options = [ file ] 

    if(config?.loop)
        options.push("--loop")

    //     if (config?.loop)
    //         command.push("--loop")
    // try {
    //     const command = ["cvlc", `'${file}'`]

    //     if (config?.loop)
    //         command.push("--loop")

    //     const commandStr = command.join(" ")
    //     const result = await execute(commandStr)

    //     return result
    // } catch (error) {
    //     throw (error)
    // }
    const cvlc = spawn("cvlc", options)

    return cvlc
}