import { S3Client } from '@aws-sdk/client-s3'
import { bucketConfig, ENVIRONMENT } from '../utils/config'

const currentBucketConfig = bucketConfig[ENVIRONMENT]

export const bucketName = currentBucketConfig.bucketName

export const s3 = new S3Client({
    region: currentBucketConfig.bucketRegion ?? '',
    credentials: {
        accessKeyId: currentBucketConfig.accessKey ?? '',
        secretAccessKey: currentBucketConfig.secretAccessKey ?? ''
    }
})