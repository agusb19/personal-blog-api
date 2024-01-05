import { s3, bucketName } from '../services/bucket'
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { asyncErrorHandler } from "../services/errorHandler"
import { SectionValidation, type ISectionsValidation } from "../validations/Sections"
import { createOkResponse, createErrorResponse } from "../helpers/appResponse"
import type { SectionController, SectionType } from "../types/sections"
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

    private async uploadImage(res: Response, data: SectionType['articleIdData'], imageFile?: Express.Multer.File) {
        
        if(!imageFile) return res.status(400).json(createErrorResponse({ 
            message: 'Validation data error, image file required' 
        }))
        
        if(data.image_name === null) return res.status(400).json(createErrorResponse({ 
            message: 'Validation data error, image name required' 
        }))

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: data.image_name,
            Body: imageFile.buffer,
            ContentType: imageFile.mimetype
        })

        await s3.send(command)

        const newIdSection = await this.sectionModel.addNew(data)

        await this.styleModel.addNew({
            ...data,
            section_id: newIdSection
        })

        return res.status(201).json(createOkResponse({
            message: 'New section image and styles created successfully'
        }))
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

        return res.status(200).json(createOkResponse({
            message: 'Sections from article requested',
            data: result
        }))
    })

    changeAll = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id, content, content_type, image_name, width, height, font_size, font_weight, font_family, line_height, margin_top, text_align`, text_color, border_radius } = req.body
        const validation = this.validateSection.idData(req.body) 

        if(!validation.success) return this.validationErr(res, validation.error)

        await this.sectionModel.changeContent(validation.data)

        const changeStyleData = {
            ...validation.data,
            section_id: validation.data.id
        }

        await this.styleModel.changeStyles(changeStyleData)

        return res.status(200).json(createOkResponse({
            message: 'Section content and styles changed successfully'
        }))
    })

    addNew = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { article_id, content, content_type, image_name, width, height, font_size, font_weight, font_family, line_height, margin_top, text_align`, text_color, border_radius } = req.body
        const validation = this.validateSection.articleIdData(req.body)

        if(!validation.success) return this.validationErr(res, validation.error)

        if(validation.data.content_type === 'image') return this.uploadImage(res, validation.data, req.file)

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

        await this.sectionModel.remove(validation.data)

        return res.status(200).json(createOkResponse({
            message: 'Section content and styles removed successfully'
        }))
    })
}