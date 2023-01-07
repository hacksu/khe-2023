import { Box, Text } from '@mantine/core';
import { Footer } from '../components/footer';
import { CampusMap } from '../components/map';
import { FrequentlyAskedQuestions } from '../components/faq2';

// import dynamic from 'next/dynamic'

// // @ts-ignore
// const FrequentlyAskedQuestions = dynamic(() => import('../components/faq').then(o => o.FrequentlyAskedQuestions), {
//   loading: () => <Text>Loading...</Text>,
// })

export function LandingLayout() {
    return <Box>
        landing layout
        {/* <CampusMap location='Design Innovation Hub' show={['Building Labels', 'Visitor Parking']} sx={{ height: 400, width: 500 }} /> */}
        <FrequentlyAskedQuestions p={10} />
        <Footer />
    </Box>
}
