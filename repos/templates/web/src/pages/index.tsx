import { ContactUs } from '@kenthackenough/ui/tickets/contact';
import { api } from '@kenthackenough/ui/trpc';
import { Title } from '@mantine/core';
import Link from 'next/link';
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
        <Title>Hey! Kent Hack Enough Website!</Title>
        <p>wooah its the web template project!</p>
        <p>ping: {ping?.data?.toLocaleString() || 'loading...'}</p>
        <p>subscription date: {date?.toLocaleString() || 'loading...'}</p>
        <Link href={'/contact'}>contact us!</Link>
        
    </div>
}

