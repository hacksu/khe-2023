import { Box, Text } from '@mantine/core';
import { Footer } from '../components/footer';
import { CampusMap } from '../components/map';
import { FrequentlyAskedQuestions } from '../components/faq';
import { useMantineTheme } from '@mantine/core';

export function LandingLayout(props: { children: JSX.Element[] }) {
    const theme = useMantineTheme();
    return <Box pt={80} mt={-80} bg='blue.0'>
        <Box sx={{ height: '100vh' }} p='md'>
            yeyeye
        </Box>
        landing layout
        {/* <CampusMap location='Design Innovation Hub' show={['Building Labels', 'Visitor Parking']} sx={{ height: 400, width: 500 }} /> */}
        {/* <FrequentlyAskedQuestions p={10} />
        <CampusMap sx={{ height: 400, width: 500 }} location='Design Innovation Hub' show={['Building Labels', 'Visitor Parking']} />
        <Footer /> */}
        {props.children}
    </Box>
}
