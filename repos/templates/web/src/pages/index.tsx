import { ContactUs } from '@kenthackenough/ui/tickets/contact';
import { api } from '@kenthackenough/ui/trpc';
import { useState } from 'react';


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
        <ContactUs />
    </div>
}

