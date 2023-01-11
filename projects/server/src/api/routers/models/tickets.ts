import { createTRPCRouter, procedure } from '../../trpc/base';
import { Ticket } from '../../../models/tickets/model';
import { z } from 'zod';



namespace INPUT {

    type Id = z.infer<typeof ID>;
    export const ID = Ticket.data.shape._id;

    type Filter = z.infer<typeof FILTER>;
    export const FILTER = Ticket.data.pick({
        status: true,
        name: true,
        subject: true,
        email: true,
        assignee: true,
    }).partial().optional();

    type Create = z.infer<typeof CREATE>;
    export const CREATE = Ticket.data.pick({
        name: true,
        email: true,
        subject: true,
        message: true,
    });

    type Update = z.infer<typeof UPDATE>;
    export const UPDATE = Ticket.data
        .pick({ _id: true })
        .merge(
            Ticket.data.omit({
                created: true,
                updated: true,
            }).partial()
        );

}



export const ticketRouter = createTRPCRouter({
    /** Get a ticket */
    get: procedure.protected({ tickets: { read: true } })
        .meta({ api: 'GET /tickets/:input' })
        .input(INPUT.ID)
        .query(async ({ input }) => {
            const ticket = await Ticket.findById(input).lean<Ticket.Data>();
            return { ticket }
        }),

    /** List tickets (can be filtered) */
    list: procedure.protected({ tickets: { read: true } })
        .meta({ api: 'GET /tickets' })
        .input(INPUT.FILTER)
        .query(async ({ input }) => {
            const tickets = await Ticket.find(input || {}).lean<Ticket.Data[]>();
            return { tickets }
        }),

    /** Create a ticket */
    create: procedure.public
        .meta({ api: 'POST /tickets/create' })
        .input(INPUT.CREATE)
        .mutation(async ({ input }) => {
            const doc = new Ticket(input);
            await doc.save();
            const ticket = doc.toObject<Ticket.Data>();
            return { ticket }
        }),

    /** Update a ticket */
    update: procedure.protected({ tickets: { write: true } })
        .meta({ api: 'PATCH /tickets/:_id' })
        .input(INPUT.UPDATE)
        .mutation(async ({ input }) => {
            // TODO: update
            return { success: false, ticket: null }
        }),

    /** Removes a ticket */
    remove: procedure.protected({ tickets: { delete: true } })
        .meta({ api: 'DELETE /tickets/:input' })
        .input(INPUT.ID)
        .mutation(async ({ input, ctx }) => {
            // TODO: implement
            return { success: false }
        }),

})
