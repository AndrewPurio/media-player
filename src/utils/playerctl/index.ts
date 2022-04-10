import { execute } from "../execute"
import { MediaPlayerConfig, MediaPlayerEvent } from "../types"

export default async function playerctl(command: keyof typeof MediaPlayerEvent, config?: MediaPlayerConfig) {
    const playerCommand = ["playerctl", command]

    if (config) {
        playerCommand.push(config.value.toString())
    }

    try {
        const command = playerCommand.join(" ")
        const { stderr, stdout } = await execute(command)

        console.log("StdOut:", stderr, stdout)

        return {
            stderr, stdout
        }
    } catch (error) {
        throw error
    }
}