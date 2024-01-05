import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3, bucketName } from '../services/bucket'
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand  } from "@aws-sdk/client-s3"
import { asyncErrorHandler } from "../services/errorHandler"
import { SectionValidation, type ISectionsValidation } from "../validations/Sections"
import { createOkResponse, createErrorResponse } from "../helpers/appResponse"
import type { SectionController } from "../types/sections"
import type { Request, Response } from 'express'
import { type ISection } from "../types/sections"
import { type IStyle } from "../types/styles"
import { type ZodError } from "zod"

type ModelsType = {
    styleModel: IStyle
    sectionModel: ISection
}

export class Sections implements SectionController {
    private styleModel: IStyle
    private sectionModel: ISection
    private validateSection: ISectionsValidation

    constructor({ sectionModel, styleModel }: ModelsType) {
        this.styleModel = styleModel
        this.sectionModel = sectionModel
        this.validateSection = new SectionValidation()
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
        // const { article_id_query } = req.query 
        const validation = this.validateSection.articleIdQuery(req.query)
        
        if(!validation.success) return this.validationErr(res, validation.error)

        const article_id = parseInt(validation.data.article_id_query, 10)
        
        if(isNaN(article_id)) {
            return res.status(400).json(createErrorResponse({
                message: 'Article Id can not be transform into a number'
            }))      
        }

        const result = await this.sectionModel.getAll({ article_id: article_id })

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: result[0].image_name
        })

        result[0].image_name = await getSignedUrl(s3, command, { expiresIn: 43200 })

        return res.status(200).json(createOkResponse({
            message: 'Sections from article requested',
            data: result
        }))
    })

    changeAll = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id, content, content_type, width, height, font_size, font_weight, font_family, line_height, margin_top, text_align`, text_color, border_radius } = req.body
        const validation = this.validateSection.idData(req.body) 

        if(!validation.success) return this.validationErr(res, validation.error)

        const sectionData = await this.sectionModel.getData({ id: validation.data.id })

        const isImageType = validation.data.content_type === 'image'
        const imageName = sectionData[0].image_name

        if(isImageType) {
            if(!req.file) return res.status(400).json(createErrorResponse({ 
                message: 'Validation data error, image file required' 
            }))

            await this.uploadImage(sectionData[0].image_name, req.file)

        } else if(imageName !== null) {
            const command = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: imageName
            })
    
            await s3.send(command)
        }

        await this.sectionModel.changeContent({
            ...validation.data,
            image_name: isImageType ? imageName : null
        })

        await this.styleModel.changeStyles({
            ...validation.data,
            section_id: validation.data.id
        })

        return res.status(200).json(createOkResponse({
            message: 'Section content and styles changed successfully'
        }))
    })

    addNew = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { article_id, content, content_type, image_name, width, height, font_size, font_weight, font_family, line_height, margin_top, text_align`, text_color, border_radius } = req.body
        const validation = this.validateSection.articleIdData(req.body)

        if(!validation.success) return this.validationErr(res, validation.error)

        if(validation.data.content_type === 'image') {
            if(!req.file) return res.status(400).json(createErrorResponse({ 
                message: 'Validation data error, image file required' 
            }))
            
            if(validation.data.image_name === null) return res.status(400).json(createErrorResponse({ 
                message: 'Validation data error, image name required' 
            }))

            await this.uploadImage(validation.data.image_name, req.file)
        }

        const newIdSection = await this.sectionModel.addNew(validation.data)

        await this.styleModel.addNew({
            ...validation.data,
            section_id: newIdSection
        })

        return res.status(201).json(createOkResponse({
            message: 'New section content and styles created successfully'
        }))
    })

    remove = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id } = req.body
        const validation = this.validateSection.id(req.body)

        if(!validation.success) return this.validationErr(res, validation.error)

        const sectionData = await this.sectionModel.getData({ id: validation.data.id })

        if(sectionData[0].image_name !== null) {
            const command = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: sectionData[0].image_name
            })
    
            await s3.send(command)
        }

        await this.sectionModel.remove(validation.data)

        return res.status(200).json(createOkResponse({
            message: 'Section content and styles removed successfully'
        }))
    })
}