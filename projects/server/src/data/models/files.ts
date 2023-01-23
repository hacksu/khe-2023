import { z } from 'zod';
import { timestampData } from '../includes/timestamped';
import { Infer, Populate } from '../../utils/zod';
import { UserData, UserRole, UserRoles } from './users';

/** @export 'data/files' */

export type FileType = typeof FileTypes[number];
export const FileTypes = [
    'resume',
    'attachment',
    'asset',
] as const;



/** Infer schema & populatable types
 * - One can use `Populate` from `utils/zod` to coerce that a field is populated with other documents
 * @example 
 *  - FileData['user'] -> string | undefined
 *  - Populate<FileData, 'user'>['user'] -> UserData
 */
export type FileData = Infer<typeof fileData, {
    user: UserData
}>;

/** [Relations](https://mongoosejs.com/docs/populate.html)
 * - Mongodb relationships are stored as object ids `z.string()` but can use TypeScript to define what they'd populate into.
 * - Define relations below; **be sure to only use** `z.string()` for the documents themselves
 * - Define the correct type in the `FileData` infer above
 */
const fileRelations = z.object({
    /** File User (who created this file)
     * - {@link userData.shape.id user.id} or {@link userData}
     * - See {@link https://mongoosejs.com/docs/populate.html Mongoose.populate}
     */
    user: z.string().optional(),
})

export const fileData = z.object({
    /** File ID */
    _id: z.string(),
    /** The type of file */
    type: z.enum(FileTypes),
    /** The MIME-type of the file */
    mime: z.string(),
    /** How many bytes is this file */
    bytes: z.number(),
    /** The path to this file */
    path: z.string(),
    access: z.object({
        users: z.array(z.string()),
        roles: z.array(z.enum(UserRoles)),
        // roles: z.array(z.nativeEnum(UserRole)),
    })
}).merge(fileRelations).merge(timestampData);


// const woah: FileData = {
//     type: ''
//     access: {
//         users: ['123'],
//         // roles: [UserRole.User],
//         roles: ['admin'],
//     }
// }

