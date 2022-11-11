import { z } from 'zod';
import { timestampData } from '../includes/timestamped';

/** @export 'data/users' */


export enum UserRole {
    Pending = 'pending',
    User = 'user',
    Staff = 'staff',
    Admin = 'admin',
}


export type UserData = z.infer<typeof userData>;
export const userData = z.object({
    /** User ID */
    _id: z.string(),
    /** User's email */
    email: z.string().email(),
    /** User's password
     * - Hashed with `bcrypt` during assignment.
     */
    password: z.string().optional(),
    /** User's role */
    role: z.nativeEnum(UserRole).default(UserRole.Pending),
}).merge(timestampData)


