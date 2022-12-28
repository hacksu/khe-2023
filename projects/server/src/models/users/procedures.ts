import { UserData } from '../../data/models/users';
import { t } from '../../services/trpc';
import { Populate } from '../../utils/zod';
import { User } from './model';


export const userProcedures = t.router({

    list: t.procedure.query(async () => {
        const users = await User.find();
        console.log({ users })
        return users;
    }),

})