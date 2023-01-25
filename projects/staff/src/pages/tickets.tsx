import { createRouteParameter } from '@kenthackenough/react/hooks';
import { TicketStatus, TicketStatuses } from '@kenthackenough/server/data';
import { useIsBreakpoint, useIsMobile } from '@kenthackenough/ui/app';
import { api } from '@kenthackenough/ui/trpc';
import { Box, SegmentedControl, Grid, Title, Divider, Text, Badge, Group } from '@mantine/core';
import Head from 'next/head';
import { TicketsList, useTicketStatusParam } from 'ui/models/tickets/list';
import { Ticket } from 'ui/models/tickets/ticket';
import { onlyIf } from 'utils/mantine';


export default function TicketsPage() {
    const status = useTicketStatusParam(o => o.value) || 'open';
    const isMobile = useIsMobile();
    return <Box>
        <Head>
            <title>Tickets - Kent Hack Enough</title>
        </Head>
        <Box py={'xl'}>
            <Grid px={isMobile ? 40 : 100}>
                <Grid.Col span={!isMobile ? 4 : 12} sx={{ display: 'flex', justifyContent: !isMobile ? 'left' : 'center', alignItems: 'center' }}>
                    <Title>
                        Tickets
                    </Title>
                </Grid.Col>
                <Grid.Col span={!isMobile ? 8 : 12} sx={{ display: 'flex', justifyContent: !isMobile ? 'right' : 'center' }}>
                    <SegmentedControl value={status} onChange={(value) => {
                        useTicketStatusParam.setState({
                            value: value === 'open' ? undefined : value as any,
                        })
                    }} data={[
                        { label: <ControlLabel label='Open' status='open' />, value: 'open' },
                        { label: <ControlLabel label='Assigned' status='assigned' />, value: 'assigned' },
                        { label: <ControlLabel label='Closed' status='closed' />, value: 'closed' },
                        { label: <ControlLabel label='Resolved' status='resolved' />, value: 'resolved' },
                    ] as { label: JSX.Element, value: TicketStatus }[]} />
                </Grid.Col>
            </Grid>
        </Box>
        <Divider />
        <Box py={'xl'} mb={'xl'}>
            <TicketsList />
        </Box>
    </Box>
}


function ControlLabel(props: { status: TicketStatus, label: string }) {
    const isNotWide = useIsBreakpoint('lg');
    const isActive = (useTicketStatusParam(o => o.value) || 'open') === props.status;

    return <Group sx={{ flexWrap: 'nowrap' }} spacing={'xs'} py={2} px={8}>
        <Text display={'inline-block'}>{props.label}</Text>
        {(!isNotWide || isActive) && <Ticket.CountBadge status={props.status} />}
    </Group>
}
