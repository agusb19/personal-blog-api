import createAuthentication from '../auth/authentication'
import { asyncErrorHandler } from '../services/errorHandler'
import { UsersValidation, type IUsersValidation } from '../validations/Users'
import { createOkResponse, createErrorResponse } from '../helpers/appResponse'
import type { NextFunction, Request, Response } from "express"
import { type UserController } from '../types/users'
import { type IUser } from '../types/users'
import { type ZodError } from 'zod'

export class Users implements UserController {
    private compareHash
    private registerHash
    private overwriteHash
    private signWithoutHash
    private userModel: IUser
    private validateUser: IUsersValidation

    constructor({ userModel }: { userModel: IUser }) {
        const { compareHash, registerHash, overwriteHash, signWithoutHash } = createAuthentication({ userModel })
        this.userModel = userModel
        this.compareHash = compareHash
        this.registerHash = registerHash
        this.overwriteHash = overwriteHash
        this.signWithoutHash = signWithoutHash
        this.validateUser = new UsersValidation()
    }

    private noUserId(res: Response) {
        return res.status(401).json(createErrorResponse({
            message: 'User ID missing, please login again'
        }))
    }
    
    private validationErr(res: Response, validationError: ZodError<unknown>) {
        return res.status(400).json(createErrorResponse({
            message: 'Validation data error',
            error: validationError.format()
        }))
    } 

    getAll = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id } = req.query
        if(!req.userId.id) return this.noUserId(res)

        const result = await this.userModel.getAll(req.userId)

        return res.status(200).json(createOkResponse({
            message: 'User data requested',
            data: result
        }))
    })

    getId = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        // const { api_key } = req.body
        const validation = this.validateUser.apiKey(req.body)

        if(!validation.success) return this.validationErr(res, validation.error)

        const result = await this.userModel.getId(validation.data)

        if(result.length === 0) {
            return res.status(401).json(createErrorResponse({
                message: 'Incorrect api key'
            }))
        }

        this.signWithoutHash(result[0].id, res, next)
    })
    
    getPassword = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        // const { name, password } = req.body
        const validation = this.validateUser.namePassword(req.body)

        if(!validation.success) return this.validationErr(res, validation.error)

        const result = await this.userModel.getIdPassword(validation.data)

        if(result.length === 0) {
            return res.status(401).json(createErrorResponse({
                message: 'Incorrect username'
            }))
        }

        const compareHashData = {
            modelResult: { id: result[0].id, password: result[0].password },
            validatedData: validation.data
        }

        return this.compareHash(compareHashData, res, next)
    })

    changeName = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id, name } = req.body
        if(!req.userId.id) return this.noUserId(res)
        
        const validation = this.validateUser.idName({...req.body, ...req.userId}) 

        if(!validation.success) return this.validationErr(res, validation.error)

        const name = await this.userModel.getName(validation.data)

        if(name.length !== 0) {
            return res.status(401).json(createErrorResponse({
                message: 'Existing username'
            }))
        }

        await this.userModel.changeName(validation.data)

        return res.status(200).json(createOkResponse({
            message: 'Username changed successfully'
        }))
    })

    changeEmail = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id, email } = req.body
        if(!req.userId.id) return this.noUserId(res)

        const validation = this.validateUser.idEmail({...req.body, ...req.userId}) 

        if(!validation.success) return this.validationErr(res, validation.error)

        const email = await this.userModel.getEmail(validation.data)

        if(email.length !== 0) {
            return res.status(401).json(createErrorResponse({
                message: 'Existing email'
            }))
        }

        await this.userModel.changeEmail(validation.data)

        return res.status(200).json(createOkResponse({
            message: 'User email changed successfully'
        }))
    })  

    changeAuthor = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id, author } = req.body
        if(!req.userId.id) return this.noUserId(res)

        const validation = this.validateUser.idAuthor({...req.body, ...req.userId}) 

        if(!validation.success) return this.validationErr(res, validation.error)

        await this.userModel.changeAuthor(validation.data)

        return res.status(200).json(createOkResponse({
            message: 'User author name changed successfully'
        }))
    })  

    changePassword = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id, password } = req.body
        if(!req.userId.id) return this.noUserId(res)

        const validation = this.validateUser.idPassword({...req.body, ...req.userId}) 

        if(!validation.success) return this.validationErr(res, validation.error)

        return this.overwriteHash(validation.data, res)
    })  

    addNew = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
        // const { name, password, email, phone, author } = req.body
        const validation = this.validateUser.data(req.body) 

        if(!validation.success) return this.validationErr(res, validation.error)

        const name = await this.userModel.getName(validation.data)
        const email = await this.userModel.getEmail(validation.data)

        if(name.length !== 0) {
            return res.status(401).json(createErrorResponse({
                message: 'Existing username'
            }))
        }

        if(email.length !== 0) {
            return res.status(401).json(createErrorResponse({
                message: 'Existing email'
            }))
        }

        return this.registerHash(validation.data, res, next)
    })  

    remove = asyncErrorHandler(async (req: Request, res: Response) => {
        // const { id } = req.body
        if(!req.userId.id) return this.noUserId(res)
        
        await this.userModel.remove(req.userId)

        return res.status(200).json(createOkResponse({
            message: 'User removed successfully'
        }))
    })

    cleanUp = asyncErrorHandler(async (_req: Request, res: Response) => {
        await this.userModel.cleanUp()

        return res.status(200).json(createOkResponse({
            message: 'User table cleanup successfully'
        }))
    })
}

export default Users