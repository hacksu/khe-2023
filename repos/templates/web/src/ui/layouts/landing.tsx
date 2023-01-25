import { Box, Text, Button } from '@mantine/core';
import { Footer } from 'ui/components/footer';
import { CampusMap } from 'ui/components/map';
import { FrequentlyAskedQuestions } from 'ui/components/faq';
import { useMantineTheme } from '@mantine/core';
import { useSession } from '@kenthackenough/ui/auth';


export function LandingLayout(props: { children: JSX.Element[] }) {
    const theme = useMantineTheme();
    const session = useSession();
    return <Box pt={80} mt={-80} bg='blue.0'>
        <Box sx={{ height: '100vh' }} p='md'>
            yeyeye, {JSON.stringify(session)}
            <Button onClick={() => session?.logout()}>Logout</Button>
        </Box>
        landing layout
        {/* <CampusMap location='Design Innovation Hub' show={['Building Labels', 'Visitor Parking']} sx={{ height: 400, width: 500 }} /> */}
        {/* <FrequentlyAskedQuestions p={10} />
        <CampusMap sx={{ height: 400, width: 500 }} location='Design Innovation Hub' show={['Building Labels', 'Visitor Parking']} />
        <Footer /> */}
        {props.children}
    </Box>
}
