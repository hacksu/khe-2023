import { TicketData, ticketData } from '../../data/models/tickets';
import { access } from '../../services/permissions/middleware';
import { t } from '../../services/trpc';
import { Ticket } from './model';



export const ticketProcedures = t.router({
    /** Get a ticket */
    get: t.procedure
        .meta({ api: 'GET /tickets/:input' })
        .use(access({ tickets: { read: true } }))
        .input(ticketData.shape._id)
        .query(async ({ input }) => {
            const ticket = await Ticket.findById(input).lean<TicketData>();
            return { ticket }
        }),

    /** List tickets (can be filtered) */
    list: t.procedure
        .meta({ api: 'GET /tickets' })
        .use(access({ tickets: { read: true } }))
        .input(ticketData.pick({
            status: true,
            name: true,
            subject: true,
            email: true,
            assignee: true,
        }).partial().optional())
        .query(async ({ input }) => {
            const tickets = await Ticket.find(input || {}).lean<TicketData[]>();
            return { tickets }
        }),

    /** Create a ticket */
    create: t.procedure
        .meta({ api: 'POST /tickets/create' })
        .input(ticketData.pick({
            name: true,
            email: true,
            subject: true,
            message: true,
        }))
        .mutation(async ({ input }) => {
            // if (true) throw new Error('oof, failed');
            // const doc = new Ticket.Model(input);
            const doc = new Ticket(input);
            await doc.save();
            const ticket = doc.toObject<TicketData>();
            return { ticket }
        }),

    /** Update a ticket */
    update: t.procedure
        .meta({ api: 'PATCH /tickets/:_id' })
        .use(access({ tickets: { write: true } }))
        .input(ticketData.pick({ _id: true }).merge(
            ticketData.omit({ _id: true }).partial()
        ))
        .mutation(async ({ input }) => {
            // TODO: update
            return { success: false, ticket: null }
        }),

    /** Removes a ticket */
    remove: t.procedure
        .meta({ api: 'DELETE /tickets/:input' })
        .use(access({ tickets: { delete: true }}))
        .input(ticketData.shape._id)
        .mutation(async ({ input, ctx }) => {
            // TODO: implement
            return { success: false }
        }),

})
