import { Box, Paper, Text, Textarea, TextInput, Title } from '@mantine/core';
import { api } from '../../utils/trpc';


export function TicketsList() {
    const query = api.tickets.list.useQuery();
    return <Box>
        <Title order={3}>Tickets</Title>
        <Box style={{ display: 'flex', gap: 10 }}>
            {query.data?.tickets.map(ticket => (
                <Paper key={ticket._id.toString()} style={{ width: 300, padding: 10 }} withBorder>
                    <Text c="dimmed">Ticket {ticket._id}</Text>
                    <TextInput readOnly label="Email" value={ticket.email || ''} />
                    <TextInput readOnly label="Name" value={ticket.name || ''} />
                    <TextInput readOnly label="Subject" value={ticket.subject || ''} />
                    <Textarea readOnly label="Message" value={ticket.message || ''} autosize />
                </Paper>
            ))}
        </Box>
    </Box>
}