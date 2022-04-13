"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playMedia = void 0;
const child_process_1 = require("child_process");
/**
 * Play a media file/url
 * @param file The absolute path or url of the media to play
 */
function playMedia(file, config) {
    const options = [file];
    if (config?.loop)
        options.push("--loop");
    (0, child_process_1.spawn)("cvlc", options);
}
exports.playMedia = playMedia;
