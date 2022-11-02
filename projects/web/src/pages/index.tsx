import { useState } from 'react';
import { api } from '../utils/trpc';


export default function Homepage() {
    const ping = api.ping.useQuery();
    const [date, setDate] = useState<Date>(null!);
    api.onDate.useSubscription(undefined, {
        onData(data) {
            setDate(data.date);
        },
    })
    return <div>
        Hey! Kent Hack Enough Website!
        <p>ping: {ping?.data?.toLocaleString() || 'loading...'}</p>
        <p>subscription date: {date?.toLocaleString() || 'loading...'}</p>
    </div>
}

// export default function Homepage() {
//     return <div>heya</div>
// }