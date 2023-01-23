import { createRouteParameter } from '@kenthackenough/react/hooks';
import { TicketStatus } from '@kenthackenough/server/data/tickets';
import { api } from '@kenthackenough/ui/trpc';
import { Badge, Code, Group, MantineColor, Modal, ScrollArea, Text, Textarea } from '@mantine/core';
import { Card } from '@mantine/core';
import { useRef } from 'react';
import zustand from 'zustand';


const TICKET_STATUS_COLORS: Record<TicketStatus, MantineColor> = {
    [TicketStatus.Open]: 'green',
    [TicketStatus.Assigned]: 'yellow',
    [TicketStatus.Closed]: 'gray',
}


const queryParam_Ticket = createRouteParameter({ name: 'ticket', type: String });

type UseTickets = {
    opened?: string;
    open(id: string): void;
    close(): void;
}

export const useTickets = zustand<UseTickets>(set => ({
    open(id) {
        queryParam_Ticket.setState({ value: id })
    },
    close() {
        queryParam_Ticket.setState({ value: undefined })
    },
}))

export function TicketEntry(props: { id: string }) {
    const open = useTickets(o => o.open);
    const opened = useTickets(o => o.opened);
    const query = api.tickets.get.useQuery(props.id, {
        enabled: !Boolean(opened),
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
    const close = useTickets(o => o.close);
    const opened = Boolean(id);

    const _id = useRef(id || '');
    if (opened) _id.current = id!;

    const query = api.tickets.get.useQuery(_id.current, {
        enabled: opened,
    });
    const ticket = query.data?.ticket;
    // if (!ticket) return <></>;

    const title = ticket && <Group position='apart'>
        <Group spacing={'xs'}>
            <Text>Ticket</Text>
            <Code>{id}</Code>
        </Group>
        <Badge color={TICKET_STATUS_COLORS[ticket.status]}>
            {ticket.status}
        </Badge>
    </Group>

    return <Modal opened={false && opened} onClose={() => close()} title={title} styles={() => ({
        title: {
            flexGrow: 1
        }
    })}>
        <Text weight={500}>{ticket?.subject}</Text>
        <ScrollArea style={{ height: 400, maxHeight: '40vh' }} p={'sm'}>
            <Textarea value={ticket?.message} autosize minRows={2} readOnly variant='unstyled' />
        </ScrollArea>
    </Modal>
}
