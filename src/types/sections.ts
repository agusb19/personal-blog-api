import { z } from 'zod'
import { sectionSchema } from '../schemas/sections'
import { type RowDataPacket } from 'mysql2'
import { type AsyncFunction } from '../services/errorHandler'

export type SectionType = {
    id: z.infer<typeof sectionSchema.id>
    idData: z.infer<typeof sectionSchema.idData>
    articleId: z.infer<typeof sectionSchema.articleId>
    idContent: z.infer<typeof sectionSchema.idContent>
    articleIdData: z.infer<typeof sectionSchema.articleIdData>
    articleIdQuery: z.infer<typeof sectionSchema.articleIdQuery>
    articleIdContent: z.infer<typeof sectionSchema.articleIdContent>
}

export interface ISection {
    getAll({ article_id }: SectionType['articleId']): Promise<RowDataPacket[]>
    changeContent({ id, content, content_type, image_name }: SectionType['idContent']): Promise<RowDataPacket[]>
    addNew({ article_id, content, content_type, image_name }: SectionType['articleIdContent']): Promise<number>
    remove({ id }: SectionType['id']): Promise<RowDataPacket[]>
}

export interface SectionController {
    getAll: AsyncFunction
    changeAll: AsyncFunction
    addNew: AsyncFunction
    remove: AsyncFunction
}