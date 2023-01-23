import { TicketStatus, ticketData } from '@kenthackenough/server/data';
import { ModelController } from '../model';
import { Text, Group, Badge, Code, MantineColor, ScrollArea, Textarea, Card } from '@mantine/core';
import { api } from '@kenthackenough/ui/trpc';
import { useRef } from 'react';


export const TICKET_STATUS_COLORS: Record<TicketStatus, MantineColor> = {
    open: 'green',
    assigned: 'yellow',
    closed: 'gray',
}

export const Ticket = Object.assign(new ModelController({
    name: 'ticket',
    schema: ticketData,
    title(props) {
        const query = api.tickets.get.useQuery(props.id, {
            enabled: props.opened,
        });

        const ticket = query.data?.ticket;
        return ticket ? <Group position='apart'>
            <Group spacing={'xs'}>
                <Text>Ticket</Text>
                <Code>{props.id}</Code>
            </Group>
            <Badge color={TICKET_STATUS_COLORS[ticket.status]}>
                {ticket.status}
            </Badge>
        </Group> : <></>
    },
}, (props) => {
    const { id, opened } = props;

    const _id = useRef(id || '');
    if (opened) _id.current = id!;

    const query = api.tickets.get.useQuery(_id.current, {
        enabled: opened,
    });

    const ticket = query.data?.ticket;

    return <>
        <Text weight={500}>{ticket?.subject}</Text>
        <ScrollArea style={{ height: 400, maxHeight: '40vh' }} p={'sm'}>
            <Textarea value={ticket?.message} autosize minRows={2} readOnly variant='unstyled' />
        </ScrollArea>
    </>
}), {
    Entry: TicketEntry,
})



function TicketEntry(props: { id: string }) {
    const open = Ticket.use(o => o.open);
    const opened = Ticket.use(o => o.opened);
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

