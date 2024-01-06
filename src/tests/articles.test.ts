import path from 'path'
import request from 'supertest'
import { app} from '../server'
import { userMock, artileMock } from './mockData'

let articleId: number
let token: string

const imagePath = path.resolve(__dirname, '../../public/Image Test.png')

export default (RESOURCE: string) => {
    const USER_RESOURCE = RESOURCE.replace('/article', '/user')
    
    describe('Clean test environment', () => {
        
        test('should CLEANUP database tables', async () => {
            await request(app)
                .delete(`${USER_RESOURCE}/cleanup`)
                .expect(200)
        })
    })

    describe('Get access and user data for articles route', () => {
        
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
    })

    describe('Test create and read new article post', () => {
        
        test('should POST new article', async () => {
            await request(app)
                .post(RESOURCE)
                .set('Authorization', `Bearer ${token}`)
                .send(artileMock.newArticle)
                .attach('image', imagePath, { filename: 'Image Test.png', contentType: 'image/png' })
                .expect(201)
        })
        
        test('should READ and GET ID from new article', async () => {
            const response = await request(app)
                .get(RESOURCE)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
            articleId = response.body.result.data[0].id
                
            expect(response.body.result.data[0]).toEqual(
                expect.objectContaining({
                  ...artileMock.newArticle,
                  image_name: expect.anything()
                })
            )  
        })
    })

    describe('Test update new article post', () => {
        
        test('should PATCH INFO of new article', async () => {
            await request(app)
                .patch(`${RESOURCE}/data`)
                .set('Authorization', `Bearer ${token}`)
                .send(artileMock.newData(articleId))
                .expect(200)
        })

        test('should PATH PUBLISH STATE of new article', async () => {
            await request(app)
                .patch(`${RESOURCE}/publishment`)
                .set('Authorization', `Bearer ${token}`)
                .send(artileMock.newPublishState(articleId))
                .expect(200)
        })

        test('should READ changed data from changed article', async () => {
            const response = await request(app)
                .get(RESOURCE)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                
            expect(response.body.result.data[0]).toEqual(
                expect.objectContaining({
                    ...artileMock.newData(articleId),
                    image_name: expect.anything(),
                    id: articleId,
                    is_publish: 1
                })
            )  
        })
    })

    describe('Test delete new article post', () => {
       
        test('should DELETE new article', async () => {
            await request(app)
                .delete(RESOURCE)
                .set('Authorization', `Bearer ${token}`)
                .send({ id: articleId })
                .expect(200)
        })

        test('should READ no data from deleted article', async () => {
            const response = await request(app)
                .get(RESOURCE)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)

            expect(response.body.result.data).toHaveLength(0)
        })        
    })
}