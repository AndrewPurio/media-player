import { exec, execFile } from "child_process";
import { promisify } from "util";

export async function execute(command: string): Promise<{ stdout: any, stderr: string }> {
    // const execute_command = promisify(exec)

    // return execute_command(command)
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if(error)
                return reject(error)

            resolve({
                stdout, stderr
            })
        })
    })
}

export async function executeFile(filePath: string) {
    const execute_file = promisify(execFile)

    return execute_file(filePath)
}