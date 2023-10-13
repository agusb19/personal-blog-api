import { asyncErrorHandler } from "../utils/errorHandler"
import { SectionValidation, type ISectionsValidation } from "../validations/Sections"
import { createOkResponse, createErrorResponse } from "../utils/appResponse"
import type { Request, Response } from 'express'
import { type SectionController } from "../types/sections"
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
        return res.status(401).json(createErrorResponse({
            message: 'Validation data error',
            error: validationError.format()
        }))
    }

    getAll = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { article_id } = req.query 
        const validation = this.validateSection.articleId(req.query)
        
        if(!validation.success) return this.validationErr(res, validation.error)

        const result = await this.sectionModel.getAll(validation.data)

        return res.status(200).json(createOkResponse({
            message: 'Sections from article requested',
            data: result
        }))
    })

    changeAll = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id, content, fontSize, fontWeight, fontFamily, lineHeight, marginTop, textAlign`, textColor } = req.body
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
        // const { article_id, content, fontSize, fontWeight, fontFamily, lineHeight, marginTop, textAlign`, textColor } = req.body
        const validation = this.validateSection.articleIdData(req.body)

        if(!validation.success) return this.validationErr(res, validation.error)

        const newIdSection = await this.sectionModel.addNew(validation.data)

        const addNewStyles = {
            ...validation.data,
            section_id: newIdSection
        }

        await this.styleModel.addNew(addNewStyles)

        return res.status(200).json(createOkResponse({
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