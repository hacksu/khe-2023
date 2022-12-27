import { ActionIcon, Box, Button, Divider, Grid, Group, GroupedTransition, Input, NumberInput, Paper, PasswordInput, Stack, Tooltip, Transition } from '@mantine/core';
// require = require('esm')(module);
// import GithubProvider from '@auth/core/providers/github';
import { signIn } from 'next-auth/react';
import { SignInWith, useAuthProviders } from '@kenthackenough/ui/authentication';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BackIcon } from '@tabler/icons';
import { faArrowLeft } from '@cseitz/icons/regular/arrow-left';
import { faRightToBracket } from '@cseitz/icons/regular/right-to-bracket'
import { faEnvelope } from '@cseitz/icons/regular/envelope';
import { faLockHashtag } from '@cseitz/icons/regular/lock-hashtag';
import { faKey } from '@cseitz/icons/regular/key';
import { Icon } from '@cseitz/icons';
import { Text } from '@mantine/core';
import { FieldPath } from 'react-hook-form';
import { NextRouter, Router, useRouter } from 'next/router';
import { isArray, isObject, isPlainObject, merge, reduce, toPairs } from 'lodash';


const BackArrowIcon = Icon(faArrowLeft)
const RightToBracketIcon = Icon(faRightToBracket)
const EmailIcon = Icon(faEnvelope);
const KeyIcon = Icon(faKey);
const PinLockIcon = Icon(faLockHashtag);

export default function LoginPage() {
    const github = () => {
        signIn('github');
    }
    const providers = useAuthProviders();
    const [step, setStep] = useState(0);
    return <Box>
        <LoginFrame />
    </Box>
}


type StepPaths<T extends object> = FieldPath<T> | null;


function useSteps<C extends {
    steps: object,
    router?: NextRouter
}>(config: C) {
    const [step, _setStep] = useState<StepPaths<C['steps']>>(null);
    const depth = step === null ? 0 : step.split('.').length;

    const history = useMemo(() => {
        const arr = new Array<StepPaths<C['steps']>>();
        return arr;
    }, []);

    const _step = step;
    const [previous, setPrevious] = useState<typeof step>(step);
    const setStep = (step: StepPaths<C['steps']>) => {
        setPrevious(_step);
        history.push(step);
        _setStep(step);
    }

    const back = () => {
        const current = step;
        if (current) {
            const computed = current.split('.').slice(0, -1).join('.');
            if (computed && computed.length > 0) {
                return setStep(computed as any);
            } else {
                return setStep(null);
            }
        }
    }

    const first = useRef(true);
    useEffect(() => {
        if (config.router && config.router.isReady) {
            const rstep: any = config.router.query?.s === undefined ? null : config.router.query?.s;
            if (first.current) {
                setTimeout(() => {
                    first.current = false;
                }, 100)
                setStep(rstep);
                if (rstep) {
                    setPrevious(rstep.split('.').slice(0, -1).join('.') || null);
                }
            } else {
                if (rstep != step) {
                    // console.log('diff step', { step, rstep });
                    setStep(rstep);
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config?.router?.query]);

    useEffect(() => {
        if (config.router && config.router.isReady && !first.current) {
            const query = config.router.query;
            const before = JSON.stringify(query);
            if (step === null) {
                delete query?.s;
            } else {
                query.s = step;
            }
            if (JSON.stringify(query) !== before) {
                config.router.push({
                    query,
                })
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    return {
        step,
        setStep,
        back,
        depth,
        previous,
    }
}


function LoginFrame() {
    const router = useRouter();
    const { step, setStep, back, depth, previous } = useSteps({
        router,
        steps: {
            email: {
                code: {}
            },
            password: {},
        }
    })
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
    const providers = useAuthProviders();
    const width = 300;
    const [code, setCode] = useState<number | undefined>(undefined);
    return <Box sx={{ opacity: Number(ready), transition: 'opacity 0.15s' }}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '95vw', height: '50vh', overflowX: 'hidden' }}>
            <Box sx={{ width, maxWidth: '90vw', textAlign: 'center', margin: 'auto' }}>
                <Box sx={{ height: 100 }}>
                    <Box sx={{ position: 'absolute', width }}>
                        <Transition mounted={step === null} transition='slide-right' duration={duration} timingFunction='ease'>
                            {(styles) => (<Paper withBorder style={styles} p='sm'>
                                <Box sx={{ maxWidth: width }} p={10}>
                                    <Stack spacing={'xs'}>
                                        <Button size='md' leftIcon={<EmailIcon />} onClick={() => { setStep('email') }} color='teal'>Sign in with Email</Button>
                                        <Button size='md' leftIcon={<KeyIcon />} onClick={() => { setStep('password') }} color='blue'>Sign in with Password</Button>
                                        <Divider />
                                        {Object.keys(providers || {}).filter(o => o != 'credentials').map(id => (
                                            <SignInWith strategy={id as any} key={id} size='md' />
                                        ))}

                                    </Stack>
                                </Box>
                            </Paper>)}
                        </Transition>
                    </Box>
                    <Box sx={{ position: 'absolute', width }}>
                        <Transition mounted={step === 'password'} transition={previous?.startsWith('password.') ? 'slide-right' : 'slide-left'} duration={duration} timingFunction='ease'>
                            {(styles) => (<Paper withBorder style={styles} p='sm'>
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
                            </Paper>)}
                        </Transition>
                    </Box>
                    <Box sx={{ position: 'absolute', width }}>
                        <Transition mounted={step === 'email'} transition={step?.startsWith('email.') || previous?.startsWith('email.') ? 'slide-right' : 'slide-left'} duration={duration} timingFunction='ease'>
                            {(styles) => (<Paper withBorder style={styles} p='sm'>
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
                            </Paper>)}
                        </Transition>
                    </Box>
                    <Box sx={{ position: 'absolute', width }}>
                        <Transition mounted={step === 'email.code'} transition={step?.startsWith('email.code.') || previous?.startsWith('email.code.') ? 'slide-right' : 'slide-left'} duration={duration} timingFunction='ease'>
                            {(styles) => (<Paper withBorder style={styles} p='sm'>
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
                                        'input': code ? {
                                            letterSpacing: '0.5em',
                                            textAlign: 'center',
                                            paddingRight: '36px',
                                        } : {},
                                    })} value={code} onChange={(value) => setCode(value!)} />
                                    <Button>Verify</Button>
                                </Stack>
                            </Paper>)}
                        </Transition>
                    </Box>
                </Box>
                {/* <Button onClick={() => setStep(Math.max(0, step - 1))}>-</Button>
        <Button onClick={() => setStep(Math.min(1, step + 1))}>+</Button> */}
            </Box>
        </Box>
    </Box>
}


