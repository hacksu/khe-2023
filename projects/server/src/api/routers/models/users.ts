import { createTRPCRouter, procedure } from '../../trpc/base';
import { User } from '../../../models/users/model';
import { z } from 'zod';



namespace INPUT {

    type Id = z.infer<typeof ID>;
    export const ID = User.data.shape._id;

}



export const userRouter = createTRPCRouter({
    /** Get a user */
    get: procedure.protected({ users: { read: true } })
        .meta({ api: 'GET /users/:input' })
        .input(INPUT.ID)
        .query(async ({ input }) => {
            const user = await User.findById(input).lean<User.Data>();
            return { user }
        }),

    /** List tickets (can be filtered) */
    list: procedure.protected({ users: { read: true } })
        .meta({ api: 'GET /tickets' })
        .query(async ({ input }) => {
            const users = await User.find().lean<User.Data[]>();
            return { users }
        }),

})
