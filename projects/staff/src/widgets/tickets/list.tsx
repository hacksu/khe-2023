import { TicketStatus } from '@kenthackenough/server/data/tickets';
import { Box, Paper, Text, Textarea, TextInput, Title } from '@mantine/core';
import { Ticket } from './ticket';
import { api } from '@kenthackenough/ui/trpc';


export function TicketsList() {
    const utils = api.useContext();
    const query = api.tickets.list.useQuery({ status: TicketStatus.Open }, {
        onSuccess(data) {
            // Automatically populate individual tickets
            for (const ticket of data.tickets) {
                utils.tickets.get.setData(ticket._id, { ticket });
            }
        },
    });
    const stuff = query.data?.tickets;
    return <Box>
        <Title order={3}>Tickets 1234</Title>
        <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {query.data?.tickets.map(ticket => (
                <Ticket.Entry key={ticket._id.toString()} id={ticket._id.toString()} />
            ))}
        </Box>
        <Ticket.Modal />
    </Box>
}

