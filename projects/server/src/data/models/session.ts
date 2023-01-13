import type { Session as NextAuthSession } from 'next-auth';
import { timestampData } from '../includes/timestamped';
import { Infer, Populate } from '../../utils/zod';
import { UserData } from './users';
import { z } from 'zod';

/** @export 'data/session' */


// @ts-ignore
const nextAuthSessionData = z.object<NextAuthSession>({}).passthrough();


/** Infer schema & populatable types
 * - One can use `Populate` from `utils/zod` to coerce that a field is populated with other documents
 * @example 
 *  - SessionData['user'] -> string | undefined
 *  - Populate<SessionData, 'assignee'>['user'] -> UserData
 */
export type SessionData = Infer<typeof sessionData, {
    user: UserData
}>;

/** [Relations](https://mongoosejs.com/docs/populate.html)
 * - Mongodb relationships are stored as object ids `z.string()` but can use TypeScript to define what they'd populate into.
 * - Define relations below; **be sure to only use** `z.string()` for the documents themselves
 * - Define the correct type in the `SessionData` infer above
 */
const sessionRelations = z.object({
    /** Session user
     * - {@link userData.shape.id user.id} or {@link userData}
     * - See {@link https://mongoosejs.com/docs/populate.html Mongoose.populate}
     */
    user: z.string().optional(),
})

export const sessionData = z.object({
    /** Session id */
    _id: z.string(),
    /** Session token */
    sessionToken: z.string(),
}).merge(nextAuthSessionData).merge(sessionRelations).merge(timestampData);



