import fs from 'fs'

export default function createDirIfNotExist(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}
