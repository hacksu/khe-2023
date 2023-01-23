import { useMediaQuery } from '@mantine/hooks';
import { Burger } from '@mantine/core';
import { Group } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { Box } from '@mantine/core';
import { Header as NavHeader, Modal as MantineModal } from '@mantine/core';
import zustand from 'zustand';
import { Navbar } from '@mantine/core';
import { NavLink } from '@mantine/core';
import { Grid } from '@mantine/core';
import { Button } from '@mantine/core';
import { ButtonProps } from '@mantine/core';
import { MantineColor } from '@mantine/core';
import { ContextType, createContext, useContext } from 'react';
import { NavLinkProps } from '@mantine/core';
import { useProps, useUserAgent } from '@kenthackenough/react/hooks';
import { Icon } from '@cseitz/icons';
import { faHome } from '@cseitz/icons-regular/home';
import { Divider } from '@mantine/core';
import { Menu } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useIsMobile } from '@kenthackenough/ui/app';

const HomeIcon = Icon(faHome);


export type UseNavigation = {
    opened: boolean;
    open(): void;
    close(): void;
    toggle(to?: boolean): void;
}

export const useNavigation = zustand<UseNavigation>(set => ({
    opened: false,
    open() { set({ opened: true }) },
    close() { set({ opened: false }) },
    toggle(to) {
        set(state => ({
            opened: to !== undefined ? to : !state.opened,
        }))
    },
}))






export namespace Navigation {

    export const use = useNavigation;

    const LinkLocationContext = createContext<'header' | 'modal' | 'menu'>('header');

    export function Header() {
        const theme = useMantineTheme();
        const isMobile = useIsMobile();
        const isReady = useMediaQuery(`(min-width: 0px)`);

        const opened = useNavigation(o => o.opened);
        const toggle = useNavigation(o => o.toggle);

        const color: MantineColor = 'blue';
        const opacity = isReady ? 1 : 0;

        return <NavHeader height={{ base: 50, md: 60 }} bg={color} c='white'>
            <LinkLocationContext.Provider value='header'>
                <Grid sx={{ gap: 0, height: '100%', alignItems: 'center', overflow: !isReady ? 'hidden' : undefined }} p={0} m={0}>
                    <Grid.Col span={isMobile ? 7 : 8} sx={{ display: 'flex' }}>
                        <Burger opened={opened} onClick={() => toggle()} color='white' hidden={!isMobile} />
                        <Group spacing={8} hidden={isMobile} sx={{ opacity: isMobile ? 0 : undefined }}>
                            <Links />
                        </Group>
                    </Grid.Col>
                    <Grid.Col span='auto' sx={{ display: 'flex', justifyContent: 'right' }}>
                        <Button>hi</Button>
                    </Grid.Col>
                </Grid>
            </LinkLocationContext.Provider>
            <Modal />
        </NavHeader>
    }

    function Links() {
        // eslint-disable-next-line react/no-children-prop
        return <>
            <Item label='Home' leftIcon={<HomeIcon />} href='/' />
            <Item label='About' rightIcon={<HomeIcon />} />
            <Item label='Sponsors' />
            <Item label='Contact' href='/contact' />
            {/* eslint-disable-next-line react/no-children-prop */}
            <Item label='Schedule' children={[
                { label: 'woah' },
                { label: 'hi there', href: '/contact' }
            ]} />
        </>
    }

    function Modal() {
        const opened = useNavigation(o => o.opened);
        const close = useNavigation(o => o.close);

        return <MantineModal opened={opened} onClose={() => close()} title='Kent Hack Enough'>
            <LinkLocationContext.Provider value='modal'>
                <Box>
                    <Divider orientation='horizontal' opacity={0.25} />
                    <Links />
                </Box>
            </LinkLocationContext.Provider>

        </MantineModal>
    }

    export function Bar() {
        const opened = useNavigation(o => o.opened);
        return <Navbar hidden={!opened}>
            <NavLink title='hi there!' />
        </Navbar>
    }


    export type NavigationEntry = {
        children?: Omit<NavigationEntry, 'children'>[];
        label: string;
        href?: string;
        leftIcon?: JSX.Element | string;
        rightIcon?: JSX.Element | string;
    }

    export function Item(entry: NavigationEntry & { location?: ContextType<typeof LinkLocationContext> }) {
        const _location = useContext(LinkLocationContext);
        const location = entry?.location || _location;

        if (location === 'header') {
            return <Items.HeaderItem {...entry} />
        } else if (location === 'modal') {
            return <Items.ModalItem {...entry} />
        } else if (location === 'menu') {
            return <Items.MenuItem {...entry} />
        }
        throw new Error('oof');
    }

    namespace Items {

        function WrapLink(entry: { children: any } & Pick<NavigationEntry, 'href'>) {
            const close = useNavigation(o => o.close);
            if (entry.href) {
                return <NextLink legacyBehavior href={entry.href} passHref style={{ textDecoration: 'inherit' }} onClick={() => close()}>
                    {entry.children}
                </NextLink>
            }
            return entry.children;
        }

        export function HeaderItem(entry: NavigationEntry) {
            const { label, children, leftIcon, rightIcon, href, ...props } = useProps(entry, {

            })

            const btn = <Button leftIcon={leftIcon} rightIcon={rightIcon} {...props}>
                {label}
            </Button>

            if (typeof window === 'undefined' || !children || children.length === 0) {
                return <WrapLink href={href}>
                    {btn}
                </WrapLink>;
            }

            return <Menu trigger='hover' width={200}>
                <Menu.Target>
                    {btn}
                </Menu.Target>
                <Menu.Dropdown>
                    <LinkLocationContext.Provider value='menu'>
                        {children && children.map((o, i) => (
                            <Item {...o} key={i} />
                        ))}
                    </LinkLocationContext.Provider>
                </Menu.Dropdown>
            </Menu>
        }

        export function ModalItem(entry: NavigationEntry) {
            const { label, children, leftIcon, rightIcon, href, ...props } = useProps(entry, {

            })

            return <>
                <WrapLink href={href}>
                    <NavLink label={label} icon={leftIcon} rightSection={rightIcon} {...props}>
                        {children && children.map((o, i) => (
                            <Item {...o} key={i} />
                        ))}
                    </NavLink>
                </WrapLink>
                <Divider orientation='horizontal' opacity={0.25} />
            </>
        }

        export function MenuItem(entry: NavigationEntry) {
            const { label, children, leftIcon, rightIcon, href, ...props } = useProps(entry, {

            })

            return <WrapLink href={href}>
                <Menu.Item icon={leftIcon} rightSection={rightIcon} {...props}>
                    {label}
                </Menu.Item>
            </WrapLink>
        }
    }


}