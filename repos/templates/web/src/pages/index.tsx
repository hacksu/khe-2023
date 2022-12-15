import { ContactUs } from '@kenthackenough/ui/tickets/contact';
import { api } from '@kenthackenough/ui/trpc';
import { Title } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';


export default function Homepage() {
    // const ping = api.ping.useQuery(undefined, {
    //     onSuccess(data) {
    //         console.log('did fetch', data);
    //     },
    // });
    return <div>
        <Title>Hey! Kent Hack Enough Website!</Title>
        <p>wooah its the web template project!</p>
        {/* <p>ping: {ping?.data?.toLocaleString() || 'loading...'}</p> */}
        <Link href={'/contact'}>contact us!</Link>
    </div>
}

