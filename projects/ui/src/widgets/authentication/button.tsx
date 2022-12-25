import type { AuthProviderId } from '@kenthackenough/server/auth';
import { Button } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getProviders } from 'next-auth/react';

export function SignInWith(props: {
    strategy: Exclude<AuthProviderId, 'credentials'>
}) {
    const { strategy, ...rest } = props;
    const query = useQuery(['next-auth', 'providers'], () => (
        getProviders()
    ));
    const provider = query?.data?.[props.strategy as string];
    console.log({ provider })
    return <Button>
        Sign in with {'Google'}
    </Button>
}