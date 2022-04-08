export enum MediaPlayerEvent {
    play,
    pause,
    "play-pause",
    stop,
    status,
    volume
}

export interface MediaPlayerConfig {
    value: number
}