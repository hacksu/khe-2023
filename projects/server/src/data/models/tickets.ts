import { z } from 'zod';
import { timestampData } from '../includes/timestamped';

/** @export 'data/tickets' */


export enum TicketStatus {
    Closed = 'closed',
    Open = 'open',
    Assigned = 'assigned',
}


export type TicketData = z.infer<typeof ticketData>;
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
    status: z.nativeEnum(TicketStatus).default(TicketStatus.Open),
    /** Ticket Assignee (who is handling this ticket)
     * - {@link userData.shape.id user.id} or {@link userData}
     * - See {@link https://mongoosejs.com/docs/populate.html Mongoose.populate}
     */
    assignee: z.string().optional(),
}).merge(timestampData);


