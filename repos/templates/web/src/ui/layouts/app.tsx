import { Header } from '@mantine/core';
import { Box } from '@mantine/core';
import { AppShellProps } from '@mantine/core';
import { AppShell } from '@mantine/core';
import { useMemo } from 'react';
import { useMediaQuery, useWindowScroll } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/core';
import { HeaderProps } from '@mantine/core';
import { BoxProps } from '@mantine/core';
import { Paper } from '@mantine/core';
import { Burger } from '@mantine/core';
import { ColorSchemeProvider } from '@mantine/core';
import { Navigation } from 'ui/components/navigation';





export function AppLayout(props: { children: any }) {
    const shellProps = useMemo<Omit<AppShellProps, 'children'>>(() => ({
        children: props.children,
        header: <Navigation.Header />,
        // navbar: <Navigation.Bar />,
        padding: 0,
    }), [props]);
    return <AppShell {...shellProps}>
        {props.children}
    </AppShell>
}


// function Navigation(props: {
//     color?: string,
//     /** Will the navigation bar be transparent until scrolled? */
//     transparent?: boolean,
// }) {
//     const theme = useMantineTheme();
//     const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

//     const {
//         color = theme.colors[theme.primaryColor][theme.fn.primaryShade()],
//     } = props;

//     theme.fn.fontStyles()

//     const [scroll] = useWindowScroll();
//     const isScrolled = scroll.y > 0;
//     const headerProps: Omit<HeaderProps, 'children'> = {
//         height: { base: 50, md: 60 },
//         withBorder: false,
//         sx: {
//             backgroundColor: 'transparent',
//         }
//     }

//     const barProps: Omit<BoxProps, 'children'> = {
//         p: 'md',
//         sx: {
//             backgroundColor: isScrolled ? color : 'transparent',
//             borderBottom: `1px solid ${theme.fn.rgba((
//                 theme.colorScheme === 'light' ? theme.fn.darken(color, 0.2) : theme.fn.lighten(color, 0.2)
//             ), isScrolled ? 1 : 0)}`,
//             transition: 'all 0.15s',
//         },
//     }

//     return <Header {...headerProps}>
//         <Box {...barProps}>
//             <ColorSchemeProvider colorScheme={isScrolled ? 'dark' : 'light'} toggleColorScheme={() => {}}>
            

//             <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
//                 <Burger opened={false} />
//                 hi, {isMobile ? 'mobile' : 'desktop'}
//             </Box>

//             </ColorSchemeProvider>
//         </Box>
//     </Header>
// }