import { promises as fs } from 'fs'
import path from 'path'

/**
 * Where the showcase content is kept.
 *
 * - On Vercel (or anywhere BLOB_READ_WRITE_TOKEN is set): one private object
 *   in Vercel Blob, because a serverless filesystem is read-only.
 * - Everywhere else: data/showcase.json beside the app.
 */
const BLOB_PATH = 'showcase/showcase.json'
const FILE = path.join(process.cwd(), 'data', 'showcase.json')

const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN)

/** The saved JSON text, or null when nothing has been saved yet. Throws if the store cannot be reached. */
export async function readStored(): Promise<string | null> {
  if (useBlob()) {
    const { get } = await import('@vercel/blob')
    // useCache: false reads the origin, so the kiosk sees an edit straight away.
    const found = await get(BLOB_PATH, { access: 'private', useCache: false })
    if (!found || !found.stream) return null
    return await new Response(found.stream).text()
  }
  try {
    return await fs.readFile(FILE, 'utf8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw err
  }
}

export async function writeStored(json: string): Promise<void> {
  if (useBlob()) {
    const { put } = await import('@vercel/blob')
    await put(BLOB_PATH, json, {
      access: 'private',
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: 'application/json',
    })
    return
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  const tmp = FILE + '.tmp'
  await fs.writeFile(tmp, json, 'utf8')
  await fs.rename(tmp, FILE)
}
