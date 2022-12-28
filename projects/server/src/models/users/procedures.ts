import { t } from '../../services/trpc';
import { User } from './model';


export const userProcedures = t.router({

    list: t.procedure.query(async () => {
        const users = await User.find();
        console.log({ users })
        return users;
    }),

})