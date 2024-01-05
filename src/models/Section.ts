import type { ResultSetHeader, RowDataPacket, Pool } from "mysql2/promise"
import type { SectionType, ISection } from "../types/sections"
import { SectionQueries } from "../types/queries"
import { sectionQueries } from "../utils/queries"

class Section implements ISection {
    private pool

    constructor({ sectionPool }: { sectionPool: Pool }) {
        this.pool = sectionPool
    }

    getAll = async ({ article_id }: SectionType['articleId']) => {
        const connection = await this.pool.getConnection()

        const [rows] = await connection.execute(
            sectionQueries[SectionQueries.getAll],
            [article_id]
        )

        connection.release()
        return rows as RowDataPacket[]
    }

    getData = async ({ id }: SectionType['id']) => {
        const connection = await this.pool.getConnection()

        const [rows] = await connection.execute(
            sectionQueries[SectionQueries.getData],
            [id]
        )

        connection.release()
        return rows as RowDataPacket[]
    }

    changeContent = async ({ id, content, content_type, image_name }: SectionType['idContent']) => {
        const connection = await this.pool.getConnection()

        const [rows] = await connection.execute(
            sectionQueries[SectionQueries.changeContent],
            [content, content_type, image_name, id]
        )

        connection.release()
        return rows as RowDataPacket[]
    }

    addNew = async ({ article_id, content, content_type, image_name }: SectionType['articleIdContent']) => {
        const connection = await this.pool.getConnection()

        const [results] = await connection.execute(
            sectionQueries[SectionQueries.addNew],
            [article_id, content, content_type, image_name]
        ) as ResultSetHeader[]

        const newId = results.insertId

        connection.release()
        return newId as number
    }

    remove = async ({ id }: SectionType['id']) => {
        const connection = await this.pool.getConnection()

        const [rows] = await connection.execute(
            sectionQueries[SectionQueries.remove],
            [id]
        )

        connection.release()
        return rows as RowDataPacket[]
    }
}

export default Section