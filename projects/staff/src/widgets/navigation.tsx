import { useMediaQuery } from '@kenthackenough/react/hooks';
import { Box, Burger, Drawer, NavLink, Navbar } from '@mantine/core';
import { useEffect, useRef } from 'react';
import zustand from 'zustand';


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

    console.log({ isMobile })

    return <Navbar p="md" hiddenBreakpoint="sm" hidden={!isOpen} width={{ base: 240  }}>
        <Box>yeya</Box>
        {/* <NavigationBar /> */}
    </Navbar>

    // return <>
    //     <Drawer opened={isOpen} onClose={() => toggle(false)} padding={'xl'} sx={{ height: '100vh' }}>
    //         <NavigationBar />
    //     </Drawer>
    //     {!isOpen && !isMobile && <NavigationBar />}
    // </>

}

function NavigationBar() {
    return <>
        <NavLink
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
        </NavLink>
    </>
}