import { spawn } from "node:child_process"
import path from "node:path"

const relativeDistDir = ".next-local"
const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next")

const child = spawn(process.execPath, [nextBin, "dev", "--webpack"], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_DIST_DIR: relativeDistDir,
  },
})

let shuttingDown = false

function terminateChildTree() {
  if (!child.pid) return
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" })
    return
  }
  child.kill("SIGTERM")
}

function shutdown(code = 0) {
  if (shuttingDown) return
  shuttingDown = true
  terminateChildTree()
  process.exit(code)
}

process.on("SIGINT", () => shutdown(0))
process.on("SIGTERM", () => shutdown(0))
process.on("SIGHUP", () => shutdown(0))
process.on("exit", () => terminateChildTree())

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 0)
})
