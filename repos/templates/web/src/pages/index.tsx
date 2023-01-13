import { ContactUs } from '@kenthackenough/ui/tickets/contact';
import { api } from '@kenthackenough/ui/trpc';
import { Box, Title } from '@mantine/core';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { LandingLayout } from '../ui/layouts/landing';
import { InitialRouter } from './_app';


export default function Homepage() {
    // const ping = api.ping.useQuery(undefined, {
    //     onSuccess(data) {
    //         console.log('did fetch', data);
    //     },
    // });
    return <div>
        <Title>Kent Hack Enough Website!</Title>
        <p>wooah its the web template project!</p>
        {/* <p>ping: {ping?.data?.toLocaleString() || 'loading...'}</p> */}
        <Box>
            <Link href={'/contact'}>contact us!</Link>
        </Box>
        <Box>
            <Link href={'/login'}>login</Link>
        </Box>
        <LandingLayout />
    </div>
}

