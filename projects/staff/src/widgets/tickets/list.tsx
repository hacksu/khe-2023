import { TicketStatus } from '@kenthackenough/server/data/tickets';
import { Box, Paper, Text, Textarea, TextInput, Title } from '@mantine/core';
import { api } from '../../utils/trpc';


export function TicketsList() {
    const query = api.tickets.list.useQuery({ status: TicketStatus.Open });
    const stuff = query.data?.tickets;
    return <Box>
        <Title order={3}>Tickets 1234</Title>
        <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
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