import { execute } from "../execute"
import { MediaPlayerEvent } from "../types"

export default async function playerctl(command: keyof typeof MediaPlayerEvent) {
    const playerCommand = `playerctl ${command}`

    try {
        const { stderr, stdout } = await execute(playerCommand)

        return {
            stderr, stdout
        }
    } catch (error) {
        throw error
    }
}