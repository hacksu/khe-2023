import { Box } from '@mantine/core';
import { Footer } from '../components/footer';
import { CampusMap } from '../components/map';


export function LandingLayout() {
    return <Box>
        landing layout
        <CampusMap location='Design Innovation Hub' show={['Building Labels', 'Visitor Parking']} sx={{ height: 400, width: 500 }} />
        <Footer />
    </Box>
}
