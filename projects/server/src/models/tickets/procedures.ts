import { TRPCError } from '@trpc/server';
import { access } from '../../services/permissions/middleware';
import { t } from '../../utils/trpc';
import { ticketData } from './data';
import { Ticket } from './model';



export const ticketProcedures = t.router({
    /** Get a ticket */
    get: t.procedure
        .meta({ api: 'GET /tickets/:input' })
        .use(access({ tickets: { read: true } }))
        .input(ticketData.shape._id)
        .query(async ({ input }) => {
            const ticket = await Ticket.Model.findById(input);
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
            const tickets = await Ticket.Model.find(input || {});
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
            const ticket = new Ticket.Model(input);
            await ticket.save();
            return { ticket: ticket.toObject() }
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
        .mutation(async ({ input }) => {
            // TODO: implement
            return { success: false }
        }),

})
