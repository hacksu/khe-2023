import { ContactUs } from '@kenthackenough/ui/tickets/contact';
import { Box, Flex, Title } from '@mantine/core';
import Head from 'next/head';


export default function ContactPage() {
    return <Box>
        <Head>
            <title>Contact - Kent Hack Enough</title>
        </Head>
        <Flex align='center' direction='column'>
            <Title>Contact Us!</Title>
            <Box sx={{ width: '100%', maxWidth: 500 }}>
                <ContactUs />
            </Box>
        </Flex>
    </Box>
}