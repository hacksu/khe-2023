import { AppShell, Box, NavLink, Navbar, Header, Burger, MediaQuery, useMantineTheme, HeaderProps, Aside, Text, Footer, Group } from '@mantine/core';
import { Navigation, NavigationBurger } from '../navigation';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks'


export function AppLayout(props: {
    children: any
}) {
    const theme = useMantineTheme();
    const router = useRouter();
    const { breakpoints } = theme;
    const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

    const navigationWidth = isMobile ? 0 : 240;
    const headerHeight = isMobile ? 60 : 0;

    const isAuth = router.pathname.endsWith('login') || router.pathname.endsWith('logout');

    return <AppShell
        styles={{
            main: {
                background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={!isAuth ? <Navigation /> : undefined}
        header={!isAuth ? <Header height={{ base: 50, md: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }} p='md'>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <NavigationBurger />
                </MediaQuery>
            </Box>

        </Header> : undefined}
    >
        {props.children}
    </AppShell>

    return <Box>
        <Box sx={{ position: 'fixed' }}>
            {!isAuth && <Navigation />}
            {!isAuth && <Header height={{ base: headerHeight }} hidden={!isMobile}>
                eeey, header!
            </Header>}
        </Box>
        <Box pl={navigationWidth} pt={headerHeight}>
            <Box sx={{ height: '100vh', overflowY: 'auto' }}>
                <Box p={'md'}>
                    {props.children}
                </Box>
            </Box>
        </Box>
    </Box>
}
