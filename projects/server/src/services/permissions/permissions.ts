import { merge } from 'lodash';
import { UserPermissions } from '../../models/users/model';
import { TicketPermissions } from '../../models/tickets/model';
import { ContentPermissions } from '../../data/types/content';


/** Define permission imports */
export namespace Permission {

    // Export the imported permissions
    export const Users = all(UserPermissions);
    export const Tickets = all(TicketPermissions);
    export const Content = all(ContentPermissions);

}





// ---- internals ----

/** @internal */
type Intersect<T> = (T extends any ? ((x: T) => 0) : never) extends ((x: infer R) => 0) ? R : never
function all<T extends Record<string, { [key: string]: any }>>(perms: T): T & {
    All: Intersect<T[keyof T]>
} {
    const all: any = {};
    for (const key in perms) {
        const value = perms[key];
        merge(all, value);
    }
    // @ts-ignore
    perms['All'] = all;
    return perms as any;
}

