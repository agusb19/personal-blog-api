import { randomBytes } from "crypto"
import { type UserType } from "../types/users"
import { type ArticleType } from "../types/articles"
import { type SectionType } from "../types/sections"

type UserMock = {
    signUp: UserType['data']
    badData: UserType['namePassword']
    badUser: UserType['namePassword']
    badPassword: UserType['namePassword']
    rightData: UserType['namePassword']
    patchData: UserType['data']
    newRightData: UserType['namePassword']
    newData: Omit<UserType['data'], "password">
    userData: Omit<UserType['data'], "password">
}

type ArticleMock = {
    newData: (articleId: number) => ArticleType['idData']
    newArticle: Omit<ArticleType['userIdData'], "user_id">
    newPublishState: (articleId: number) => ArticleType['idPublishState']
}

type SectionMock = {
    newSectionStyles: (articleId: number) => SectionType['articleIdData']
    changeStyles: (sectionId: number) => SectionType['idData']
}

const randomHash = randomBytes(16).toString('hex')

export const userMock: UserMock = {
    signUp: { 
        name: 'Usuario0', 
        password: '1234', 
        email: 'myEmail@gmail.com',
        author: 'Jack Smith',
    },
    userData: { 
        name: 'Usuario0', 
        email: 'myEmail@gmail.com',
        author: 'Jack Smith',
    },
    patchData: { 
        name: 'Usuario1', 
        password: '1235', 
        email: 'NewEmail@gmail.com',
        author: 'John Jackson',
    },
    newData: { 
        name: 'Usuario1', 
        email: 'NewEmail@gmail.com',
        author: 'John Jackson',
    },
    newRightData: {
        name: 'Usuario1', 
        password: '1235'
    },
    badUser: { 
        name: 'Usuarios0', 
        password: '1234' 
    },
    badPassword: { 
        name: 'Usuario0', 
        password: '1235' 
    },
    badData: { 
        name: 'Usuarios0', 
        password: '1235' 
    },
    rightData: { 
        name: 'Usuario0', 
        password: '1234' 
    }
}

export const artileMock: ArticleMock = {
    newArticle: {
        name: 'My Article Test',
        image_name: 'Jack Smith - My Article Test - Main Image',
        title: 'My Title',
        keywords: 'My Keywords',
        description: 'My Description'
    },
    newData: (articleId) => ({
            id: articleId,
            name: 'New Article Name',
            title: 'New Article Title',
            keywords: 'New Article Keywords',
            description: 'New Article Description'
    }),
    newPublishState: (articleId) => {
        return {
            id: articleId,
            is_publish: true
        }
    }
}

export const sectionMock: SectionMock = {
    newSectionStyles: (articleId: number) => {
        return {
           article_id: articleId,
           content: 'New Article Section',
           content_type: 'paragraph',
           image_name: null,
           width: '90%',
           height: 'auto',
           font_family: 'Verdana',
           font_size: '1.5rem',
           font_weight: 'bold',
           line_height: '1rem',
           margin_top: '0.25rem',
           text_align: 'right',
           text_color: 'white',
           border_radius: '0rem',
        }
    },
    changeStyles: (sectionId: number) => {
        return {
           id: sectionId,
           content: 'Image alt text',
           content_type: 'image',
           image_name: `Jack Smith - My Article Test - Image ${randomHash}`,
           width: '80%',
           height: '95%',
           font_family: 'Monospace',
           font_size: '1.25rem',
           font_weight: 'normal',
           line_height: '1.25rem',
           margin_top: '0.5rem',
           text_align: 'center',
           text_color: 'gray',
           border_radius: '0.25rem'
        }
    },
}