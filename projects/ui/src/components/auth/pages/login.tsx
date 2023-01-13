import { Box, List, Text, Stack, Button, Divider, Paper, Transition, Grid, ActionIcon, Input, PasswordInput, NumberInput, MantineTransition } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { signIn, getCsrfToken, getProviders } from 'next-auth/react';
import { api } from '../../../utils/trpc';
import { SignInWith } from '../../../widgets/authentication/button';



/** @export 'auth/pages/login' */


import { BackIcon } from '@tabler/icons';
import { faArrowLeft } from '@cseitz/icons/regular/arrow-left';
import { faRightToBracket } from '@cseitz/icons/regular/right-to-bracket'
import { faEnvelope } from '@cseitz/icons/regular/envelope';
import { faLockHashtag } from '@cseitz/icons/regular/lock-hashtag';
import { faClipboard } from '@cseitz/icons/regular/clipboard';
import { faUserPlus } from '@cseitz/icons/regular/user-plus';
import { faKey } from '@cseitz/icons/regular/key';
import { Icon } from '@cseitz/icons';
import { useSteps } from '../steps';
import { useRouter } from 'next/router';
import { useAuthProviders } from '../../../widgets/authentication';
import { useEffect, useRef, useState } from 'react';


const BackArrowIcon = Icon(faArrowLeft)
const RightToBracketIcon = Icon(faRightToBracket)
const EmailIcon = Icon(faEnvelope);
const KeyIcon = Icon(faKey);
const PinLockIcon = Icon(faLockHashtag);
const RegisterIcon = Icon(faUserPlus);



export type LoginPageProps = {

}

// eslint-disable-next-line react/display-name
export const LoginPage = (props: LoginPageProps) => () => <LoginPageComponent {...props} />;

function LoginPageComponent(props: LoginPageProps) {
    // const providers = useQuery(['next-auth', 'providers'], getProviders)?.data || {};
    // const providers = api.auth.providers.useQuery()?.data;
    // if (!providers) return <></>;
    // const { credentials, ...oauth } = providers;
    return <Box>
        <PageContainer />
    </Box>
}

function AuthProviders() {
    const providers = api.auth.providers.useQuery()?.data;
    if (!providers) return <></>;
    const { credentials, ...oauth } = providers;
    return <Box>
        <List>
            {Object.values(oauth).map((provider: any) => {
                return <List.Item key={provider.id}>{provider.name}</List.Item>
            })}
        </List>
    </Box>
}



type PageProps = ReturnType<typeof useLoginPageProps>;


function useLoginPageProps() {

    const [verificationCode, setVerificationCode] = useState<number | undefined>(undefined);

    const providers = useAuthProviders();

    const router = useRouter();
    const steps = useSteps({
        router,
        steps: {
            email: {
                code: {}
            },
            password: {},
        }
    })

    const { step } = steps;

    const firstLoad = useRef(new Date().getTime());
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const elapsed = router.isReady ? new Date().getTime() - firstLoad.current : 0;
        if (elapsed > 200) {
            setReady(true);
        } else {
            setTimeout(() => {
                setReady(true)
            }, 200)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, router.isPreview])

    const duration = ready ? 200 : 0;
    const width = 300;

    return {
        ...steps,
        verificationCode,
        setVerificationCode,
        providers,
        duration,
        width,
        ready,
    }
}

function PageContainer() {

    const pageProps = useLoginPageProps();
    const { step, setStep, back, depth, previous, ready, width, duration } = pageProps;

    const Pages = Object.entries(pages).map(([key, Component]) => {
        const p = previous || 'index';
        const s = step || 'index';
        const pd = !step || p.startsWith(s);
        // const sd = s.startsWith(p);
        const direction = step === null && previous == null ? true : !pd;
        const transition: MantineTransition = direction ? `slide-${key === s ? 'left' : 'right'}` : `slide-${key === s ? 'right' : 'left'}`
        return <Box sx={{ position: 'absolute', width }} key={key}>
            <Transition mounted={step !== null ? step === key : key === 'index'} transition={transition} duration={duration} timingFunction='ease'>
                {(styles) => (<Paper withBorder style={styles} p='sm'>
                    <Component {...pageProps} />
                </Paper>)}
            </Transition>
        </Box>
    })

    return <Box sx={{ opacity: Number(ready), transition: 'opacity 0.15s' }}>
        <Box sx={{ position: 'absolute', top: '55vh', left: '50%', transform: 'translate(-50%, -50%)', width: '95vw', height: '70vh', overflow: 'hidden' }}>
            <Box sx={{ width, maxWidth: '90vw', textAlign: 'center', margin: 'auto' }}>
                <Box sx={{ height: 100, /*marginTop: 110*/ }}>
                    {Pages}
                </Box>
            </Box>
        </Box>
    </Box>
}


const pages = {

    ['index'](props: PageProps) {
        const { width, providers, setStep } = props;
        return <Box sx={{ maxWidth: width }} p={10}>
            <Stack spacing={'xs'}>
                <Button size='md' leftIcon={<RegisterIcon />} color='indigo'>Register Account</Button>
                <Divider />
                <Button size='md' leftIcon={<EmailIcon />} onClick={() => { setStep('email') }} color='teal'>Sign in with Email</Button>
                <Button size='md' leftIcon={<KeyIcon />} onClick={() => { setStep('password') }} color='gray'>Sign in with Password</Button>
                <Divider />
                {Object.keys(providers || {}).filter(o => o != 'credentials').map(id => (
                    <SignInWith strategy={id as any} key={id} size='md' />
                ))}

            </Stack>
        </Box>
    },

    ['password'](props: PageProps) {
        const { width, providers, setStep, back } = props;
        return <>
            <Grid>
                <Grid.Col span={1}>
                    <ActionIcon onClick={() => back()}>
                        <BackArrowIcon />
                    </ActionIcon>
                </Grid.Col>
                <Grid.Col span={12 - (2 * 1)}>
                    <Text>Sign In</Text>
                </Grid.Col>
            </Grid>
            <Stack pt={'sm'} spacing={'xs'}>
                <Input type='email' placeholder='Email' icon={<EmailIcon />} />
                <PasswordInput placeholder='Password' icon={<KeyIcon />} />
                <Button>Login</Button>
            </Stack>
        </>
    },

    ['email'](props: PageProps) {
        const { width, providers, setStep, back } = props;
        return <>
            <Grid>
                <Grid.Col span={1}>
                    <ActionIcon onClick={() => back()}>
                        <BackArrowIcon />
                    </ActionIcon>
                </Grid.Col>
                <Grid.Col span={12 - (2 * 1)}>
                    <Text>Sign In</Text>
                </Grid.Col>
            </Grid>
            <Stack pt={'sm'} spacing={'xs'}>
                <Text size={'sm'}>{`We'll`} email you a link that logs you in!</Text>
                <Input type='email' placeholder='Email' icon={<EmailIcon />} />
                <Button onClick={() => setStep('email.code')}>Send me a magic link</Button>
            </Stack>
        </>
    },

    ['email.code'](props: PageProps) {
        const { width, providers, setStep, back, verificationCode, setVerificationCode } = props;
        return <>
            <Grid>
                <Grid.Col span={1}>
                    <ActionIcon onClick={() => back()}>
                        <BackArrowIcon />
                    </ActionIcon>
                </Grid.Col>
                <Grid.Col span={12 - (2 * 1)}>
                    <Text>Enter Code</Text>
                </Grid.Col>
            </Grid>
            <Stack pt={'sm'} spacing={'xs'}>
                <Text size={'sm'}>{`We'll`} email you a link that logs you in!</Text>
                <NumberInput type='number' hideControls placeholder='Enter Verification Code' icon={<PinLockIcon />} sx={() => ({
                    'input': verificationCode ? {
                        letterSpacing: '0.5em',
                        textAlign: 'center',
                        paddingRight: '36px',
                    } : {},
                })} value={verificationCode} onChange={(value) => setVerificationCode(value!)} />
                <Button>Verify</Button>
            </Stack>
        </>
    },

}