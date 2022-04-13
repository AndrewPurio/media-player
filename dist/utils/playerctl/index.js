"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const execute_1 = require("../execute");
async function playerctl(command, config) {
    const playerCommand = ["playerctl", command];
    if (config) {
        playerCommand.push(config.value.toString());
    }
    try {
        const command = playerCommand.join(" ");
        const { stderr, stdout } = await (0, execute_1.execute)(command);
        return {
            stderr, stdout
        };
    }
    catch (error) {
        throw error;
    }
}
exports.default = playerctl;
