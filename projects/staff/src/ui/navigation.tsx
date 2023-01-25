import { useMediaQuery } from '@mantine/hooks';
import { Box, Burger, Drawer, NavLink, Navbar, NavLinkProps, ThemeIcon, ActionIcon, MantineColor, Tooltip, Badge, Group, Grid, useMantineColorScheme } from '@mantine/core';
import { useEffect, useRef } from 'react';
import zustand from 'zustand';
import { logout } from '@kenthackenough/ui/auth';
import Link from 'next/link';
import { Icon } from '@cseitz/icons';
import { onlyIf } from 'utils/mantine';
import { faChartSimple } from '@cseitz/icons-regular/chart-simple';
// import { faMessageQuestion } from '@cseitz/icons-regular/message-question';
import { faMessageQuestion } from '@cseitz/icons-regular/message-question';
import { faRightFromBracket } from '@cseitz/icons-regular/right-from-bracket';
import { faCalendar } from '@cseitz/icons-regular/calendar';
import { faFolder } from '@cseitz/icons-regular/folder';
import { faQuestion } from '@cseitz/icons-regular/question';
import { faDollar } from '@cseitz/icons-regular/dollar';
import { faUser } from '@cseitz/icons-regular/user';
import { faScrewdriverWrench } from '@cseitz/icons-regular/screwdriver-wrench';
import { faFolderGrid } from '@cseitz/icons-regular/folder-grid';
import { useProps } from '@kenthackenough/react/hooks';
import { IconMoonStars, IconSun } from '@tabler/icons';
// import { TicketBadges } from './models/tickets/badges';
import dynamic from 'next/dynamic';
import { TicketCountBadge } from './models/tickets/ticket';
// import {} from '@cseitz/icons-regular';

const DashboardIcon = Icon(faChartSimple);
const TicketsIcon = Icon(faMessageQuestion);
const LogoutIcon = Icon(faRightFromBracket);
const ScheduleIcon = Icon(faCalendar);
const FolderIcon = Icon(faFolder);
const ContentIcon = Icon(faFolderGrid);
const QuestionsIcon = Icon(faQuestion);
const SponsorsIcon = Icon(faDollar);
const UsersIcon = Icon(faUser);
const ToolsIcon = Icon(faScrewdriverWrench);

// const Tooltip = dynamic(() => import('@mantine/core').then(o => o.Tooltip), {
//     ssr: false,
// })

// @ts-ignore
// const TicketBadges = dynamic(() => import('./models/tickets/badges'), {
//     ssr: false,
// })

type NavEntryConfig = {
    href?: string,
    color?: MantineColor,
    icon?: ReturnType<typeof Icon>,
    onClick?: () => any,
    children?: Omit<NavEntryConfig, 'children'>[]
} & Partial<Omit<NavLinkProps, 'icon' | 'color' | 'children'>>;

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
            href: '/users',
            label: 'Users',
            icon: UsersIcon,
            rightSection: <TicketCountBadge status='open' hideZero />
        },
        {
            href: '/tickets',
            label: 'Tickets',
            icon: TicketsIcon,
            rightSection: <TicketCountBadge status='open' hideZero />
        },
        {
            label: 'Content',
            icon: ContentIcon,
            children: [
                {
                    href: '/content/schedule',
                    label: 'Schedule',
                    icon: ScheduleIcon,
                },
                {
                    href: '/content/questions',
                    label: 'Questions',
                    icon: QuestionsIcon,
                },
                {
                    href: '/content/sponsors',
                    label: 'Sponsors',
                    icon: SponsorsIcon,
                },
            ]
        },
        {
            label: 'Tools',
            icon: ToolsIcon,
            children: [
                {
                    href: '/content/schedule',
                    label: 'Workflows',
                    icon: ScheduleIcon,
                },
                {
                    href: '/content/questions',
                    label: 'Exports',
                    icon: QuestionsIcon,
                },
                {
                    href: '/content/sponsors',
                    label: 'Links',
                    icon: SponsorsIcon,
                },
            ]
        },
    ],
    footer: [
        // {
        //     label: 'Logout',
        //     icon: LogoutIcon,
        //     onClick() {
        //         logout()
        //     },
        // },
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
    const { color, children, ...props } = useProps(entry, {
        sx: {
            borderRadius: 6,
        }
    })

    const icon = entry.icon && <ThemeIcon color={color} variant='light' p='sm' bg={'transparent'}>
        {entry.icon({

        })}
    </ThemeIcon>

    const elem = <NavLink {...{ ...props, icon }} icon={icon} key={'btn:' + entry.href}>
        {children?.map((o, i) => <NavEntry {...o} key={i} />)}
    </NavLink>

    if (entry.href) {
        return <Link href={entry.href} style={{ textDecoration: 'none' }} key={entry.href}>
            {elem}
        </Link>
    };
    return elem;
}

function NavigationBar() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

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
            <Grid grow sx={{ alignItems: 'center' }}>
                <Grid.Col span={9}>
                    <NavEntry icon={LogoutIcon} label='Logout' onClick={() => logout()} />
                </Grid.Col>
                <Grid.Col span={1} sx={{ display: 'flex', justifyContent: 'right' }}>
                    <ToggleThemeIcon />
                </Grid.Col>
            </Grid>
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

function ToggleThemeIcon() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const btn = <ActionIcon
        variant='subtle'
        // variant='light'
        // color={dark ? 'yellow' : 'blue'}
        title="Toggle color scheme"
        onClick={() => toggleColorScheme()}>
        {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
    </ActionIcon>

    if (typeof window !== 'undefined') {
        return <Tooltip label={`Switch to ${dark ? 'Light' : 'Dark'} mode`}>
            {btn}
        </Tooltip>
    }

    return btn;
}