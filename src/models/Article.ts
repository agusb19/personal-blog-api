import type { RowDataPacket, Pool } from 'mysql2/promise'
import type { ArticleType, IArticle } from '../types/articles'
import { ArticleQueries } from '../types/queries'
import { articleQueries } from '../utils/queries'

class Article implements IArticle {
    private pool

    constructor({ articlePool }: { articlePool: Pool }) {
        this.pool = articlePool
    }

    getAll = async ({ user_id }: ArticleType['userId']) => {
        const connection = await this.pool.getConnection()

        const [rows] = await connection.execute(
            articleQueries[ArticleQueries.getAll],
            [user_id]
        )

        connection.release()
        return rows as RowDataPacket[]
    }

    getData = async ({ user_id, name }: ArticleType['userIdName']) => {
        const connection = await this.pool.getConnection()

        const [rows] = await connection.execute(
            articleQueries[ArticleQueries.getData],
            [user_id, name]
        )

        connection.release()
        return rows as RowDataPacket[]
    }

    changeData = async ({ id, name, title, keywords, image_name, description }: ArticleType['idData']) => {
        const connection = await this.pool.getConnection()
        
        const [rows] = await connection.execute(
            articleQueries[ArticleQueries.changeData],
            [name, title, keywords, image_name, description, id]
        )   

        connection.release()
        return rows as RowDataPacket[]
    }

    changePublishState = async ({ id, is_publish }: ArticleType['idPublishState']) => {
        const connection = await this.pool.getConnection()
        
        const [rows] = await connection.execute(
            articleQueries[ArticleQueries.changePublishment],
            [is_publish, id]
        )

        connection.release()
        return rows as RowDataPacket[]
    }

    addNew = async ({ user_id, name, title, keywords, image_name, description }: ArticleType['userIdData']) => {
        const connection = await this.pool.getConnection()
        
        const [rows] = await connection.execute(
            articleQueries[ArticleQueries.addNew],
            [user_id, name, title, keywords, image_name, description]
        )

        connection.release()
        return rows as RowDataPacket[]   
    }

    remove = async ({ id }: ArticleType['id']) => {
        const connection = await this.pool.getConnection()

        const [rows] = await connection.execute(
            articleQueries[ArticleQueries.remove],
            [id]
        )

        connection.release()
        return rows as RowDataPacket[]
    }
}

export default Article