import { TicketStatus } from '@kenthackenough/server/data/tickets';
import { Box, Paper, Text, Textarea, TextInput, Title } from '@mantine/core';
import { Ticket } from './ticket';
import { api } from '@kenthackenough/ui/trpc';
import { createRouteParameter } from '@kenthackenough/react/hooks';


export const useTicketStatusParam = createRouteParameter({
    back: true,
    name: 'status',
    type: String as () => TicketStatus,
})


export function TicketsList() {
    const utils = api.useContext();
    const status = useTicketStatusParam(o => o.value) || 'open';
    const query = api.tickets.list.useQuery({ status }, {
        onSuccess(data) {
            // Automatically populate individual tickets
            for (const ticket of data.tickets) {
                utils.tickets.get.setData(ticket._id, { ticket });
            }
        },
    });
    return <Box>
        <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {query.data?.tickets.map(ticket => (
                <Ticket.Entry key={ticket._id.toString()} id={ticket._id.toString()} />
            ))}
        </Box>
        <Ticket.Modal />
    </Box>
}

