import { z } from 'zod';
import { timestampData } from '../includes/timestamped';
import { Infer, Populate } from '../../utils/zod';
import { UserData } from './users';

/** @export 'data/tickets' */


export type TicketStatus = typeof TicketStatuses[number];
export const TicketStatuses = [
    'open',
    'closed',
    'assigned',
    'resolved',
] as const;



/** Infer schema & populatable types
 * - One can use `Populate` from `utils/zod` to coerce that a field is populated with other documents
 * @example 
 *  - TicketData['assignee'] -> string | undefined
 *  - Populate<TicketData, 'assignee'>['assignee'] -> UserData
 */
export type TicketData = Infer<typeof ticketData, {
    assignee: UserData
}>;

/** [Relations](https://mongoosejs.com/docs/populate.html)
 * - Mongodb relationships are stored as object ids `z.string()` but can use TypeScript to define what they'd populate into.
 * - Define relations below; **be sure to only use** `z.string()` for the documents themselves
 * - Define the correct type in the `TicketData` infer above
 */
const ticketRelations = z.object({
    /** Ticket Assignee (who is handling this ticket)
     * - {@link userData.shape.id user.id} or {@link userData}
     * - See {@link https://mongoosejs.com/docs/populate.html Mongoose.populate}
     */
    assignee: z.string().optional(),
})

export const ticketData = z.object({
    /** Ticket ID */
    _id: z.string(),
    /** Contact's name */
    name: z.string()
        .min(3, 'Please enter your name!')
        .max(60, 'Name is limited to 60 characters!'),
    /** Contact's email */
    email: z.string().email('Please enter a valid email!'),
    /** Ticket subject */
    subject: z.string()
        .min(3, 'Subject is too short! Tell us more.')
        .max(100, 'Subject is limited to 100 characters.'),
    /** Ticket message */
    message: z.string()
        .min(10, 'Please write about your ticket! At least 10 characters.')
        .max(10000, 'Please keep your ticket under 10,000 characters!'),
    /** Notes for the ticket
     * - Useful to specify how a ticket was resolved.
     */
    notes: z.string().nullable(),
    /** Ticket status
     * - @see {@link TicketStatus} 
     */
    status: z.enum(TicketStatuses).default('open'),
    // status: z.nativeEnum(TicketStatus).default(TicketStatus.Open),
}).merge(ticketRelations).merge(timestampData);

