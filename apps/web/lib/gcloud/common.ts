// References
// - https://cloud.google.com/storage/docs/uploading-objects#storage-upload-object-nodejs
// - https://googleapis.dev/nodejs/storage/latest/Storage.html

import { Storage } from '@google-cloud/storage'

const storage = new Storage()

/**
 *
 */
export async function gcloudStorageUploadFromMemory(
  bucketName: string,
  destFileName: string,
  data: Buffer,
) {
  await storage.bucket(bucketName).file(destFileName).save(data)

  // console.log(`${destFileName} uploaded to ${bucketName}.`)
}

/**
 * https://github.com/googleapis/nodejs-storage/blob/HEAD/samples/makePublic.js
 */
export async function gcloudStorageMakePublic(
  bucketName: string,
  fileName: string,
) {
  const file = storage.bucket(bucketName).file(fileName)
  await file.makePublic()

  // console.log(`gs://${bucketName}/${fileName} is now public.`)

  return file.publicUrl()
}
