import { Box, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useSession } from '..';
import Head from 'next/head';

/** @export 'auth/pages/logout' */

export type LogoutPageProps = {

}

// eslint-disable-next-line react/display-name
export const LogoutPage = (props: LogoutPageProps) => () => <LogoutPageComponent {...props} />;

function LogoutPageComponent(props: LogoutPageProps) {
    const session = useSession();
    const router = useRouter();
    const tookAction = useRef(false);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!router.isReady) return;
        if (tookAction.current) return;
        tookAction.current = true;
        if (session === null) {
            console.log('no session');
            router.replace('/');
        } else {
            console.log('logout', session);
            session.logout();
        }
    }, [session, router.isReady])
    return <>
        <Head>
            <title>Logout - Kent Hack Enough</title>
        </Head>
    </>
}
