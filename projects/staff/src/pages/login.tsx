import { Box, Button } from '@mantine/core';
// require = require('esm')(module);
// import GithubProvider from '@auth/core/providers/github';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const github = () => {
        signIn('github');
    }
    return <Box>
        Login Page, <Button onClick={() => github()}>Login with Github</Button>
    </Box>
}