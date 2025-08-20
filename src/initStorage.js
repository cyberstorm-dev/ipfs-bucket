import { Storage } from '@google-cloud/storage'
import { S3Client } from '@aws-sdk/client-s3'

export default ({ bucketName, storageProvider = 'gcs' }) => {
  if (storageProvider === 's3') {
    // Hetzner Object Storage configuration for Falkenstein
    const s3Client = new S3Client({
      region: process.env.S3_REGION || 'eu-central-1',
      endpoint: process.env.S3_ENDPOINT || 'https://fsn1.your-objectstorage.com',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true, // Required for Hetzner Object Storage
    })
    
    return {
      type: 's3',
      client: s3Client,
      bucket: bucketName
    }
  } else {
    // Google Cloud Storage (default)
    const storage = new Storage()
    return {
      type: 'gcs',
      client: storage.bucket(bucketName),
      bucket: bucketName
    }
  }
}