import { Container } from '@mantine/core';
import { About } from '../ui/components/about';
import FrequentlyAskedQuestions from '../ui/components/faq';
import { Section } from '../ui/components/section';
import { Sponsors } from '../ui/components/sponsors';
import { LandingLayout } from '../ui/layouts/landing';
import { Text } from '@mantine/core';
import { Paper } from '@mantine/core';
import { Title } from '@mantine/core';
import { Footer } from '../widgets/footer';
import { CampusMap } from '../ui/components/map';


export default function Homepage() {
    return <LandingLayout>
        <Section type='primary' mih={400}>
            yoooo about
            <About />
        </Section>
        <Section type='secondary' pt={50} mih={700}>
            <Container size='md' pt='xl'>
                <Title order={3} fw='normal' ta='center'>Frequently Asked Questions</Title>
                <Paper my='lg'>
                    <FrequentlyAskedQuestions />
                </Paper>
            </Container>
        </Section>
        <Section type='primary' py={50} mih={700}>
            <Container size='sm' py='xl'>
                <Title order={3} fw='normal' ta='center'>Where?</Title>
                <Paper my='lg'>
                    <CampusMap location='Design Innovation Hub' show={['Building Labels', 'Visitor Parking']} sx={{
                        height: 500,
                        width: '100%',
                    }} />
                </Paper>
            </Container>
        </Section>
        <Section type='secondary' mih={500}>
            yeee the sponsors
            <Sponsors />
        </Section>
        <Footer />
    </LandingLayout>
}