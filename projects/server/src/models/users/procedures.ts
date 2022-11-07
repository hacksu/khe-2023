import { t } from '../../utils/trpc';
import { User } from './model';


export const userProcedures = t.router({

    list: t.procedure.query(async () => {
        const users = await User.Model.find().lean();
        console.log({ users })
        return users;
    }),

})