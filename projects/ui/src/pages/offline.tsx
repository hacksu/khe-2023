import { Title, Text, Loader, Grid, Group, Stack, Progress, Box } from '@mantine/core';


export default function OfflinePage() {
    return <Box sx={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw' }}>
        <Group position='center'>
            <Stack align='center' spacing='lg'>
                <Title>Website Offline</Title>
                <Box sx={{ width: 500, maxWidth: '60vw', marginTop: 10 }}>
                    <Progress value={100} animate />
                </Box>
                <Text>This page will reload in a few seconds!</Text>
            </Stack>
        </Group>
    </Box>
}