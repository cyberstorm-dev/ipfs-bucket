import { GetObjectCommand, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

class StorageAdapter {
  constructor(storage) {
    this.storage = storage
    this.type = storage.type
    this.client = storage.client
    this.bucketName = storage.bucket
  }

  async get(key) {
    try {
      if (this.type === 's3') {
        const command = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key
        })
        const response = await this.client.send(command)
        return await this.streamToBuffer(response.Body)
      } else {
        // GCS
        const file = this.client.file(key)
        const [data] = await file.download()
        return data
      }
    } catch (error) {
      if ((this.type === 's3' && error.name === 'NoSuchKey') || 
          (this.type === 'gcs' && error.code === 404)) {
        return null
      }
      throw error
    }
  }

  async put(key, data) {
    if (this.type === 's3') {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: data
      })
      await this.client.send(command)
    } else {
      // GCS
      const file = this.client.file(key)
      await file.save(data)
    }
  }

  async has(key) {
    try {
      if (this.type === 's3') {
        const command = new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: key
        })
        await this.client.send(command)
        return true
      } else {
        // GCS
        const file = this.client.file(key)
        const [exists] = await file.exists()
        return exists
      }
    } catch (error) {
      if ((this.type === 's3' && error.name === 'NotFound') || 
          (this.type === 'gcs' && error.code === 404)) {
        return false
      }
      throw error
    }
  }

  async delete(key) {
    if (this.type === 's3') {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key
      })
      await this.client.send(command)
    } else {
      // GCS
      const file = this.client.file(key)
      await file.delete()
    }
  }

  // Helper method to convert ReadableStream to Buffer for S3
  async streamToBuffer(stream) {
    const chunks = []
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks)))
    })
  }
}

export default StorageAdapter