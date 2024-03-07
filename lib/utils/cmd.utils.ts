import { exec } from "child_process";

export function run(command: string) {
  // Execute the command
  const child = exec(command);

  // Listen for data events on stdout and stderr
  child.stdout?.on("data", data => {
    console.log(`stdout: ${data}`);
  });

  child.stderr?.on("data", data => {
    console.error(`stderr: ${data}`);
  });

  // Listen for the exit event
  child.on("exit", code => {
    console.log(`Child process exited with code ${code}`);
  });

  // Listen for the close event
  child.on("close", code => {
    console.log(`Child process closed with code ${code}`);
  });
}
