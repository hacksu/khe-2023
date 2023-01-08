import { createRouteParameter } from '@kenthackenough/react/hooks';
import { TicketStatus } from '@kenthackenough/server/data/tickets';
import { api } from '@kenthackenough/ui/trpc';
import { Badge, Code, Group, MantineColor, Modal, ScrollArea, Text, Textarea } from '@mantine/core';
import { Card } from '@mantine/core';
import { useEffect, useRef } from 'react';
import zustand from 'zustand';


const TICKET_STATUS_COLORS: Record<TicketStatus, MantineColor> = {
    [TicketStatus.Open]: 'green',
    [TicketStatus.Assigned]: 'yellow',
    [TicketStatus.Closed]: 'gray',
}


// const routeQueryTicket = old_createRouteParameter('ticket', {
//     type: String,
// });

const queryParam_Ticket = createRouteParameter({ name: 'ticket', type: String });

type UseTickets = {
    opened?: string;
    open(id: string): void;
    close(): void;
}

export const useTickets = zustand<UseTickets>(set => ({
    open(id) {
        // routeQueryTicket.set(id);
        // set({ opened: id })
        queryParam_Ticket.setState({ value: id })
    },
    close() {
        // routeQueryTicket.set(null);
        // set({ opened: undefined })
        queryParam_Ticket.setState({ value: undefined })
    },
}))

export function TicketEntry(props: { id: string }) {
    const open = useTickets(o => o.open);
    const query = api.tickets.get.useQuery(props.id, {
        // enabled: false,
    });
    const ticket = query.data?.ticket;
    if (!ticket) return <></>;
    return <Card sx={{ width: 250 }} onClick={() => open(ticket._id)}>
        <Group position='apart'>
            <Text c='dimmed' sx={{ overflowWrap: 'anywhere' }}>{ticket.email}</Text>
            <Badge color={TICKET_STATUS_COLORS[ticket.status]}>
                {ticket.status}
            </Badge>
        </Group>
        <Text weight={500} sx={{ overflowWrap: 'anywhere', flexShrink: 1 }}>{ticket.subject}</Text>
        <Card.Section>
            <ScrollArea style={{ height: 200 }} p={'sm'}>
                <Textarea value={ticket.message} autosize minRows={2} readOnly variant='unstyled' />
            </ScrollArea>
        </Card.Section>
    </Card>
}


export function TicketModal() {
    const id = queryParam_Ticket(o => o.value);
    // const id = useTickets(o => o.opened);
    const open = useTickets(o => o.open);
    const close = useTickets(o => o.close);
    const opened = Boolean(id);

    // console.log('route param', { ticket: uuh })

    // const routedTicket = routeQueryTicket.use();
    // useEffect(() => {
    //     if (routedTicket !== id) {
    //         if (!id) {
    //             open(routedTicket);
    //         } else if (!routedTicket) {
    //             close();
    //         }
    //     }
    // }, [routedTicket, id])

    const _id = useRef(id || '');
    if (opened) _id.current = id!;

    const query = api.tickets.get.useQuery(_id.current, {
        enabled: opened,
    });
    const ticket = query.data?.ticket;
    if (!ticket) return <></>;

    const title = <Group position='apart'>
        <Group spacing={'xs'}>
            <Text>Ticket</Text>
            <Code>{id}</Code>
        </Group>
        <Badge color={TICKET_STATUS_COLORS[ticket.status]}>
            {ticket.status}
        </Badge>
    </Group>

    return <Modal opened={opened} onClose={() => close()} title={title} styles={() => ({
        title: {
            flexGrow: 1
        }
    })}>
        <Text weight={500}>{ticket.subject}</Text>
        <ScrollArea style={{ height: 400, maxHeight: '40vh' }} p={'sm'}>
            <Textarea value={ticket.message} autosize minRows={2} readOnly variant='unstyled' />
        </ScrollArea>
    </Modal>
}

