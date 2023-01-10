import { AppShell, Box, NavLink, Navbar, Header, Burger, MediaQuery, useMantineTheme, HeaderProps, Aside, Text, Footer, Group } from '@mantine/core';
import { Navigation, NavigationBurger } from '../../widgets/navigation';
import { useMediaQuery } from '@kenthackenough/react/hooks';
import { useState } from 'react';
import { useRouter } from 'next/router';


export function AppLayout(props: {
    children: any
}) {
    const theme = useMantineTheme();
    const { breakpoints } = theme;
    const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

    const navigationWidth = isMobile ? 0 : 240;
    const headerHeight = isMobile ? 60 : 0;

    // console.log('app', { isMobile })

    return <Box>
        <Box sx={{ position: 'fixed' }}>
            <Navigation />
            <Header height={{ base: headerHeight }} hidden={isMobile}>
                eeey, header!
            </Header>
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
