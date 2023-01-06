import { Box } from '@mantine/core';
import { Footer } from '../components/footer';
import { CampusMap } from '../components/map';
import { FrequentlyAskedQuestions } from '../components/faq';


export function LandingLayout() {
    return <Box>
        landing layout
        <CampusMap location='Design Innovation Hub' show={['Building Labels', 'Visitor Parking']} sx={{ height: 400, width: 500 }} />
        <FrequentlyAskedQuestions p={10} />
        <Footer />
    </Box>
}
