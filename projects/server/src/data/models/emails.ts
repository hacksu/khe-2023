import { z } from 'zod';
import { timestampData } from '../includes/timestamped';
import { Infer, Populate } from '../../utils/zod';
import { UserData } from './users';


export enum MailStatus {
    Pending = 'pending',
    Delivered = 'delivered',
    Bounced = 'bounced',
}


const mailProviders = z.union([
    z.object({
        name: z.literal('sendgrid'),
        sendgridMessageId: z.string(),
    }),
    z.object({
        name: z.literal('unknown')
    })
])



/** Infer schema & populatable types
 * - One can use `Populate` from `utils/zod` to coerce that a field is populated with other documents
 * @example 
 *  - TicketData['assignee'] -> string | undefined
 *  - Populate<TicketData, 'assignee'>['assignee'] -> UserData
 */
export type MailData = Infer<typeof mailData, {
    user: UserData
}>;

/** [Relations](https://mongoosejs.com/docs/populate.html)
 * - Mongodb relationships are stored as object ids `z.string()` but can use TypeScript to define what they'd populate into.
 * - Define relations below; **be sure to only use** `z.string()` for the documents themselves
 * - Define the correct type in the `TicketData` infer above
 */
const mailRelations = z.object({
    /** Ticket Assignee (who is handling this ticket)
     * - {@link userData.shape.id user.id} or {@link userData}
     * - See {@link https://mongoosejs.com/docs/populate.html Mongoose.populate}
     */
    user: z.string().optional(),
})

export const mailData = z.object({
    /** Message ID */
    _id: z.string(),
    /** Sender's email */
    from: z.string().email('Please enter a valid email!'),
    /** Contact's email */
    to: z.string().email('Please enter a valid email!'),
    /** Message subject */
    subject: z.string()
        .min(3, 'Subject is too short! Tell us more.')
        .max(100, 'Subject is limited to 100 characters.'),
    /** Mail status
     * - @see {@link MailStatus} 
     */
    status: z.nativeEnum(MailStatus).default(MailStatus.Pending),
    /** Was the email opened? */
    opened: z.boolean(),
    /** The mail provider used to deliver this email */
    provider: mailProviders,
}).merge(mailRelations).merge(timestampData);

