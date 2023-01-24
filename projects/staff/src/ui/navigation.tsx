import { useMediaQuery } from '@mantine/hooks';
import { Box, Burger, Drawer, NavLink, Navbar, NavLinkProps, ThemeIcon, MantineColor, Badge } from '@mantine/core';
import { useEffect, useRef } from 'react';
import zustand from 'zustand';
import { logout } from '@kenthackenough/ui/auth';
import Link from 'next/link';
import { Icon } from '@cseitz/icons';
import { onlyIf } from 'utils/mantine';
import { faChartSimple } from '@cseitz/icons-regular/chart-simple';
import { faMessageQuestion } from '@cseitz/icons-regular/message-question';
import { faRightFromBracket } from '@cseitz/icons-regular/right-from-bracket';
import { useProps } from '@kenthackenough/react/hooks';
// import { TicketBadges } from './models/tickets/badges';
import dynamic from 'next/dynamic';
import { TicketCountBadge } from './models/tickets/ticket';
// import {} from '@cseitz/icons-regular';

const DashboardIcon = Icon(faChartSimple);
const TicketsIcon = Icon(faMessageQuestion);
const LogoutIcon = Icon(faRightFromBracket);

// @ts-ignore
// const TicketBadges = dynamic(() => import('./models/tickets/badges'), {
//     ssr: false,
// })

type NavEntryConfig = {
    href?: string,
    color?: MantineColor,
    icon?: ReturnType<typeof Icon>,
    onClick?: () => any,
} & Partial<Omit<NavLinkProps, 'icon' | 'color'>>;

const links: Record<'header' | 'body' | 'footer', NavEntryConfig[]> = {
    header: [

    ],
    body: [
        {
            href: '/',
            label: 'Dashboard',
            icon: DashboardIcon,
        },
        {
            href: '/tickets',
            label: 'Tickets',
            icon: TicketsIcon,
            rightSection: <TicketCountBadge status='open' hideZero />
        },
    ],
    footer: [
        {
            label: 'Logout',
            icon: LogoutIcon,
            onClick() {
                logout()
            },
        },
    ],
}


type UseNavigation = {
    isOpen: boolean;
    toggle(open?: boolean): void;
}

export const useNavigation = zustand<UseNavigation>(set => ({
    isOpen: false,
    toggle(open) {
        if (open === undefined) {
            set(prev => ({ isOpen: !prev.isOpen }))
        } else {
            set({ isOpen: open })
        }
    },
}))

export function NavigationBurger() {
    const isOpen = useNavigation(o => o.isOpen);
    const toggle = useNavigation(o => o.toggle);
    return <Burger opened={isOpen} onClick={() => toggle()} />
}

export function Navigation() {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const isOpen = useNavigation(o => o.isOpen);
    const toggle = useNavigation(o => o.toggle);

    const first = useRef(true);
    useEffect(() => {
        if (first.current && isMobile) {
            first.current = false;
            toggle(false);
        }
    }, [isMobile]);

    // console.log({ isMobile })

    return <Navbar p="md" hiddenBreakpoint="sm" hidden={!isOpen} width={{ sm: 200, lg: 300 }}>
        {/* <Box>yeya</Box> */}
        <NavigationBar />
    </Navbar>

    // return <>
    //     <Drawer opened={isOpen} onClose={() => toggle(false)} padding={'xl'} sx={{ height: '100vh' }}>
    //         <NavigationBar />
    //     </Drawer>
    //     {!isOpen && !isMobile && <NavigationBar />}
    // </>

}


function NavEntry(entry: NavEntryConfig) {
    const { color, ...props } = useProps(entry, {
        sx: {
            borderRadius: 6,
        }
    })

    const icon = entry.icon && <ThemeIcon color={color} variant='light' p='sm'>
        {entry.icon({

        })}
    </ThemeIcon>

    const elem = <NavLink {...{ ...props, icon }} icon={icon} key={'btn:' + entry.href} />;

    if (entry.href) {
        return <Link href={entry.href} style={{ textDecoration: 'none' }} key={entry.href}>
            {elem}
        </Link>
    };
    return elem;
}

function NavigationBar() {
    return <>
        <Navbar.Section>
            {links.header.map(NavEntry)}
        </Navbar.Section>

        <Navbar.Section grow mt="md">
            {links.body.map(NavEntry)}
            {/* <Link href="/" style={{ textDecoration: 'none' }}>
                <NavLink label="Dashboard" />
            </Link>
            <Link href="/tickets" style={{ textDecoration: 'none' }}>
                <NavLink label="Tickets" />
            </Link> */}
        </Navbar.Section>

        <Navbar.Section>
            {links.footer.map(NavEntry)}
            {/* <NavLink label="Logout" onClick={() => logout()} /> */}
        </Navbar.Section>

        {/* <NavLink
            label="First parent link"
            childrenOffset={28}
        >
            <NavLink label="First child link" />
            <NavLink label="Second child link" />
            <NavLink label="Nested parent link" childrenOffset={28}>
                <NavLink label="First child link" />
                <NavLink label="Second child link" />
                <NavLink label="Third child link" />
            </NavLink>
        </NavLink>

        <NavLink
            label="Second parent link"
            childrenOffset={28}
            defaultOpened
        >
            <NavLink label="First child link" />
            <NavLink label="Second child link" />
            <NavLink label="Third child link" />
        </NavLink> */}


    </>
}