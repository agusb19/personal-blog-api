import { asyncErrorHandler } from '../services/errorHandler'
import { ArticlesValidation, type IArticlesValidation } from '../validations/Articles'
import { createOkResponse, createErrorResponse } from '../helpers/appResponse'
import type { Request, Response } from 'express'
import { type ArticleController } from '../types/articles'
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

    getAll = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id } = req.query
        const validation = this.validateArticle.userId({user_id: req.userId.id})

        if(!validation.success) return this.validationErr(res, validation.error)
        
        const result = await this.articleModel.getAll(validation.data)

        return res.status(200).json(createOkResponse({
            message: 'Articles from user requested',
            data: result
        }))
    })

    changeData = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id, name, title, image, keywords, description } = req.body
        const validation = this.validateArticle.idData(req.body)

        if(!validation.success) return this.validationErr(res, validation.error)

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
        // const { user_id, name, title, image, keywords, description } = req.body
        const validation = this.validateArticle.userIdData({...req.body, user_id: req.userId.id})

        if(!validation.success) return this.validationErr(res, validation.error)

        const result = await this.articleModel.getId(validation.data)
        
        if(result.length !== 0) {
            return res.status(401).json(createErrorResponse({
                message: 'Existing article name'
            }))
        }

        await this.articleModel.addNew(validation.data)
        
        return res.status(201).json(createOkResponse({
            message: 'New article created successfully'
        }))
    })

    remove = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id } = req.body
        const validation = this.validateArticle.id(req.body)

        if(!validation.success) return this.validationErr(res, validation.error)

        await this.articleModel.remove(validation.data)

        return res.status(200).json(createOkResponse({
            message: 'Article removed successfully'
        }))
    })
}