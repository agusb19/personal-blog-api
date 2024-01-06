import path from 'path'
import request from 'supertest'
import { app } from '../server'
import { userMock, artileMock, sectionMock } from './mockData'

let articleId: number
let sectionId: number 
let token: string

const imagePath = path.resolve(__dirname, '../../public/Image Test.png')

export default (RESOURCE: string) => {
    const USER_RESOURCE = RESOURCE.replace('/section', '/user')  
    const ARTICLE_RESOURCE = RESOURCE.replace('/section', '/article')  

    describe('Clean test environment', () => {
        
        test('should CLEANUP database tables', async () => {
            await request(app)
                .delete(`${USER_RESOURCE}/cleanup`)
                .expect(200)
        })
    })

    describe('Get access and user, article data for sections route', () => {
        
        test('should SIGN-UP new user', async () => {
            await request(app)
                .post(`${USER_RESOURCE}/register`)
                .send(userMock.signUp)
                .expect(201)
        })

        test('should LOGIN to users account', async () => {
            const response = await request(app)
                .post(`${USER_RESOURCE}/login`)
                .send(userMock.rightData)
                .expect(200)
            token = response.body.result.token
        })  

        test('should GET ARTICLE-ID from new article user', async () => {
            await request(app)
                .post(ARTICLE_RESOURCE)
                .set('Authorization', `Bearer ${token}`)
                .send(artileMock.newArticle)
                .expect(201)
            
            const response = await request(app)
                .get(ARTICLE_RESOURCE)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
            articleId = response.body.result.data[0].id
        })
    })

    describe('Test create new section in article post', () => {

        test('should POST new section', async () => {
            await request(app)
                .post(RESOURCE)
                .set('Authorization', `Bearer ${token}`)
                .send(sectionMock.newSectionStyles(articleId))
                .expect(201)
        })

        test('should READ changes and GET SECTION-ID from new section', async () => {
            const response = await request(app)
                .get(RESOURCE)
                .query({ article_id_query: articleId })
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
            sectionId = response.body.result.data[0].id

            expect(response.body.result.data[0])
               .toMatchObject(sectionMock.newSectionStyles(articleId))
        })
    })

    describe('Test update new section in article post', () => {
       
        test('should PUT data of new section', async () => {
            await request(app)
                .put(RESOURCE)
                .set('Authorization', `Bearer ${token}`)
                .send(sectionMock.changeStyles(sectionId))
                .attach('image', imagePath, { filename: 'Image Test.png', contentType: 'image/png' })
                .expect(200)
        })

        test('should READ data from changed section', async () => {
            const response = await request(app)
                .get(RESOURCE)
                .query({ article_id_query: articleId })
                .set('Authorization', `Bearer ${token}`)
                .expect(200)

            expect(response.body.result.data[0]).toEqual(
                expect.objectContaining({
                    ...sectionMock.changeStyles(sectionId),
                    image_name: expect.anything()
                })
            )  
        })
    })

    describe('Test delete new section in article post', () => {
        
        test('should DELETE new section', async () => {
            await request(app)
                .delete(RESOURCE)
                .set('Authorization', `Bearer ${token}`)
                .send({ id: sectionId })
                .expect(200)
        })

        test('should READ no data from deleted section', async () => {
            const response = await request(app)
                .get(RESOURCE)
                .query({ article_id_query: articleId })
                .set('Authorization', `Bearer ${token}`)
                .expect(200)

            expect(response.body.result.data).toHaveLength(0)
        })
    })
}