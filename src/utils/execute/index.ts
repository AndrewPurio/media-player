import { exec, execFile } from "child_process";
import { promisify } from "util";

export async function execute(command: string) {
    const execute_command = promisify(exec)

    return execute_command(command)
}

export async function executeFile(filePath: string) {
    const execute_file = promisify(execFile)

    return execute_file(filePath)
}