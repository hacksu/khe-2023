import { Box, Button, Stack } from '@mantine/core';
// require = require('esm')(module);
// import GithubProvider from '@auth/core/providers/github';
import { signIn } from 'next-auth/react';
import { SignInWith, useAuthProviders } from '@kenthackenough/ui/authentication';

export default function LoginPage() {
    const github = () => {
        signIn('github');
    }
    const providers = useAuthProviders();
    return <Box>
        Login Page, <Button onClick={() => github()}>Login with Github</Button>
        <Box sx={{ maxWidth: 250 }} p={10}>
            <Stack spacing={'xs'}>
                {Object.keys(providers || {}).map(id => (
                    <SignInWith strategy={id as any} key={id} size='md' />
                ))}
            </Stack>
        </Box>
    </Box>
}