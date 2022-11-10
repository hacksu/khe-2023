import { useState } from 'react';
import { api } from '../utils/trpc';
import { TicketsList } from '../widgets/tickets/list';


export default function Homepage() {
    const ping = api.ping.useQuery();
    const [date, setDate] = useState<Date>(null!);
    const users = api.users.list.useQuery();
    api.onDate.useSubscription(undefined, {
        onData(data) {
            setDate(data.date);
        },
    })
    return <div>
        Woah! Staff Portal!
        <p>ping: {ping?.data?.toLocaleString() || 'loading...'}</p>
        <p>subscription date: {date?.toLocaleString() || 'loading...'}</p>
        <div>{JSON.stringify(users?.data || {})}</div>
        <TicketsList />
    </div>
}

// export default function Homepage() {
//     return <div>heya</div>
// }