import { ServerState } from '../mongo/state';
import { t } from '../trpc';

export namespace ContentPermissions {
    export const Update = { content: { update: true } } as const;
    export const Delete = { content: { delete: true } } as const;
}


export const contentProcedures = t.router({

})
