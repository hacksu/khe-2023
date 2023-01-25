import { z } from 'zod';
import { timestampData } from '../includes/timestamped';
import { Infer, Populate } from '../../utils/zod';
import { TicketData } from './tickets';
import { MailData } from './emails';
import { AuthProviders, authProviders } from '../../services/auth/config';

/** @export 'data/users' */

export type UserRole = typeof UserRoles[number];
export const UserRoles = [
    'pending',
    'user',
    'staff',
    'admin'
] as const;



export type UserAuthData = z.infer<typeof userAuthData>;
export const userAuthData = z.object({
    credentials: z.object({
        /** User's password
         * - Hashed with `bcrypt` during assignment.
         */
        password: z.string(),
    }).optional(),
}).and(z.record(
    z.string(),
    z.object({
        id: z.string(),
        email: z.string().email().optional(),
        name: z.string().optional(),
        avatar: z.string().optional(),
    })
))

/** Infer schema & populatable types
 * - One can use `Populate` from `utils/zod` to coerce that a field is populated with other documents
 * @example 
 *  - TicketData['assignee'] -> string | undefined
 *  - Populate<TicketData, 'assignee'>['assignee'] -> UserData
 */
export type UserData = Infer<typeof userData, {
    emails: MailData[]
}>;

/** [Relations](https://mongoosejs.com/docs/populate.html)
 * - Mongodb relationships are stored as object ids `z.string()` but can use TypeScript to define what they'd populate into.
 * - Define relations below; **be sure to only use** `z.string()` for the documents themselves
 * - Define the correct type in the `UserData` infer above
 */
const userRelations = z.object({
    /** Emails sent to this user
     * - {@link mailData.shape.id mail.id} or {@link mailData}
     * - See {@link https://mongoosejs.com/docs/populate.html Mongoose.populate}
     */
    emails: z.array(z.string()),
})


export const userData = z.object({
    /** User ID */
    _id: z.string(),
    /** User's email */
    email: z.string().email(),
    /** User's role */
    role: z.enum(UserRoles).default('pending'),
    // role: z.nativeEnum(UserRole).default(UserRole.Pending),
    /** Authentication configuration */
    auth: userAuthData,
}).merge(userRelations).merge(timestampData)


