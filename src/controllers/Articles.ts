import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3, bucketName } from '../services/bucket'
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { asyncErrorHandler } from '../services/errorHandler'
import { ArticlesValidation, type IArticlesValidation } from '../validations/Articles'
import { createOkResponse, createErrorResponse } from '../helpers/appResponse'
import type { ArticleController } from '../types/articles'
import type { Request, Response } from 'express'
import { type IArticle } from '../types/articles'
import { type ZodError } from 'zod'

export class Articles implements ArticleController {
    private articleModel: IArticle
    private validateArticle: IArticlesValidation

    constructor({ articleModel }: { articleModel: IArticle }) {
        this.articleModel = articleModel
        this.validateArticle = new ArticlesValidation()
    }    

    private validationErr(res: Response, validationError: ZodError<unknown>) {
        return res.status(400).json(createErrorResponse({
            message: 'Validation data error',
            error: validationError.format()
        }))
    }

    private async uploadImage(imageName: string, imageFile: Express.Multer.File) {
        const command = new PutObjectCommand({
            Key: imageName,
            Bucket: bucketName,
            Body: imageFile.buffer,
            ContentType: imageFile.mimetype
        })

        await s3.send(command)
    }

    getAll = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id } = req.query
        const validation = this.validateArticle.userId({user_id: req.userId.id})

        if(!validation.success) return this.validationErr(res, validation.error)
        
        const result = await this.articleModel.getAll(validation.data)

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: result[0].image_name
        })

        result[0].image_name = await getSignedUrl(s3, command, { expiresIn: 43200 })

        return res.status(200).json(createOkResponse({
            message: 'Articles from user requested',
            data: result
        }))
    })

    changeData = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id, name, title, keywords, description } = req.body
        const validation = this.validateArticle.idData(req.body)

        if(!validation.success) return this.validationErr(res, validation.error)
        
        if(req.file) {
            const articleData = await this.articleModel.getDataById({ id: validation.data.id })
            await this.uploadImage(articleData[0].image_name, req.file)
        }

        await this.articleModel.changeData(validation.data)

        return res.status(200).json(createOkResponse({
            message: 'Article info changed successfully'
        }))
    })
    
    changePublishState = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id, is_publish } = req.body
        const validation = this.validateArticle.idPublishState(req.body)

        if(!validation.success) return this.validationErr(res, validation.error)

        await this.articleModel.changePublishState(validation.data)
        
        return res.status(200).json(createOkResponse({
            message: 'Article publish state changed successfully'
        }))
    })

    addNew = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { user_id, name, title, keywords, image_name, description } = req.body
        const validation = this.validateArticle.userIdData({...req.body, user_id: req.userId.id})

        if(!validation.success) return this.validationErr(res, validation.error)

        const result = await this.articleModel.getData(validation.data)
        
        if(result.length !== 0) return res.status(401).json(createErrorResponse({
            message: 'Existing article name'
        }))
    
        if(!req.file) return res.status(400).json(createErrorResponse({ 
            message: 'Validation data error, image file required' 
        }))

        await this.uploadImage(validation.data.image_name, req.file)
        await this.articleModel.addNew(validation.data)
        
        return res.status(201).json(createOkResponse({
            message: 'New article created successfully'
        }))
    })

    remove = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id } = req.body
        const validation = this.validateArticle.id(req.body)

        if(!validation.success) return this.validationErr(res, validation.error)

        const articleData = await this.articleModel.getDataById({ id: validation.data.id })

        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: articleData[0].image_name
        })

        await s3.send(command)

        await this.articleModel.remove(validation.data)

        return res.status(200).json(createOkResponse({
            message: 'Article removed successfully'
        }))
    })
}