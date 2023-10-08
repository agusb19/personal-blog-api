import { z } from 'zod'

const userTableSchema = z.object({
    id: z.number({
        required_error: 'User id is required',
        invalid_type_error: 'User id must be a number'
    }),
    name: z.string({
        required_error: 'User name is required',
        invalid_type_error: 'User name must be a string'
    }),
    password: z.string({
        required_error: 'User password is required',
        invalid_type_error: 'User password must be a string'
    }),
    author: z.string({
        required_error: 'User author name is required',
        invalid_type_error: 'User author name must be a string'
    }),
    email: z.string({
        required_error: 'User email address is required',
        invalid_type_error: 'User email address must be a string'
    }),
    phone: z.string({
        required_error: 'User phone number is required',
        invalid_type_error: 'User phone number must be a string'
    })
})

export const userIdSchema = userTableSchema.pick({ id: true })
export const userDataSchema = userTableSchema.omit({ id: true })
export const userNameSchema = userTableSchema.pick({ name: true })
export const userIdNameSchema = userTableSchema.pick({ id: true, name: true })
export const userIdEmailSchema = userTableSchema.pick({ id: true, email: true })
export const userIdPhoneSchema = userTableSchema.pick({ id: true, phone: true })
export const userIdAuthorSchema = userTableSchema.pick({ id: true, author: true })
export const userIdPasswordSchema = userTableSchema.pick({ id: true, password: true })