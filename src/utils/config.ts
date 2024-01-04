import { config } from 'dotenv'

config()

type DBConfig = {
    host?: string
    user?: string
    password?: string
    database?: string
}

type BucketConfig = {
    accessKey?: string
    bucketName?: string
    bucketRegion?: string
    secretAccessKey?: string
}

export const PORT = process.env.PORT ?? 3000
export const ENVIRONMENT = process.env.NODE_ENV ?? 'production'

export const JWT_EXPIRE = process.env.JWT_EXPIRE
export const SECRET_KEY = process.env.SECRET_KEY

export const dbConfig: {[env: string]: DBConfig} = {
    development: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
    production: {
        host: process.env.PROD_DB_HOST,
        user: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_DATABASE,
    },
    test: {
        host: process.env.TEST_DB_HOST,
        user: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASSWORD,
        database: process.env.TEST_DB_DATABASE,
    },
}

export const bucketConfig: {[env: string]: BucketConfig} = {
    development: {
        accessKey: process.env.DEV_ACCESS_KEY,
        bucketName: process.env.DEV_BUCKET_NAME,
        bucketRegion: process.env.DEV_BUCKET_REGION,
        secretAccessKey: process.env.DEV_SECRET_ACCESS_KEY,
    },
    production: {
        accessKey: process.env.PROD_ACCESS_KEY,
        bucketName: process.env.PROD_BUCKET_NAME,
        bucketRegion: process.env.PROD_BUCKET_REGION,
        secretAccessKey: process.env.PROD_SECRET_ACCESS_KEY,
    },
    test: {
        accessKey: process.env.TEST_ACCESS_KEY,
        bucketName: process.env.TEST_BUCKET_NAME,
        bucketRegion: process.env.TEST_BUCKET_REGION,
        secretAccessKey: process.env.TEST_SECRET_ACCESS_KEY,
    }
}